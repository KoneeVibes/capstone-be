import type { Request, Response } from "express";
import Case from "../../model/case.ts";
import User from "../../model/user.ts";
import Dispute from "../../model/dispute.ts";

const editableStatuses = [
	"assigned",
	"accepted",
	"closed",
	"disputed",
] as const;

type EditableStatus = (typeof editableStatuses)[number];

const isEditableStatus = (value: unknown): value is EditableStatus =>
	typeof value === "string" &&
	(editableStatuses as readonly string[]).includes(value);

const assignmentRoles = ["super-admin", "admin", "manager"] as const;

class ControllerError extends Error {
	readonly statusCode: number;
	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;
	}
}

const updateCase = async (req: Request, res: Response) => {
	const { caseId } = req.params;
	const currentUser = (
		req as Request & {
			user?: { id: string; role: string; type: string; email: string };
		}
	).user;

	if (!caseId || !currentUser?.id || !currentUser.role) {
		return res.status(400).json({
			status: "fail",
			message: "Case ID or authenticated user was not found. Cannot proceed.",
		});
	}

	const body = req.body ?? {};
	const hasStatus = Object.prototype.hasOwnProperty.call(body, "status");
	const hasAssigneeId = Object.prototype.hasOwnProperty.call(
		body,
		"assigneeId",
	);

	const requestedStatus: unknown = body.status;
	const requestedAssigneeId: unknown = body.assigneeId;

	if (!hasStatus && !hasAssigneeId) {
		return res.status(400).json({
			status: "fail",
			message: "Provide a status, an assignee ID, or both.",
		});
	}

	if (hasStatus && !isEditableStatus(requestedStatus)) {
		return res.status(400).json({
			status: "fail",
			message: "Invalid status. Cannot proceed.",
		});
	}

	if (
		hasAssigneeId &&
		(typeof requestedAssigneeId !== "string" ||
			requestedAssigneeId.trim().length === 0)
	) {
		return res.status(400).json({
			status: "fail",
			message: "A valid assignee ID is required.",
		});
	}

	const status = hasStatus ? (requestedStatus as EditableStatus) : undefined;
	const assigneeId = hasAssigneeId
		? (requestedAssigneeId as string).trim()
		: undefined;

	if (
		assigneeId !== undefined &&
		status !== undefined &&
		status !== "assigned"
	) {
		return res.status(400).json({
			status: "fail",
			message: `assigneeId cannot be provided when changing status to ${status}.`,
		});
	}

	if (status === "assigned" && assigneeId === undefined) {
		return res.status(400).json({
			status: "fail",
			message: "An assignee ID is required when assigning a case.",
		});
	}

	const isAssignmentRole = assignmentRoles.includes(
		currentUser.role as (typeof assignmentRoles)[number],
	);
	const session = await Case.startSession();

	try {
		let updatedCase: Awaited<ReturnType<typeof Case.findOneAndUpdate>> | null =
			null;

		await session.withTransaction(async () => {
			const foundCase = await Case.findOne({ id: caseId })
				.session(session)
				.exec();

			if (!foundCase) {
				throw new ControllerError(404, "Case not found.");
			}

			if (status === undefined && assigneeId !== undefined) {
				if (!isAssignmentRole) {
					throw new ControllerError(
						403,
						"Only a super-admin, admin, or manager may assign or reassign a case.",
					);
				}

				if (
					!["payment-validated", "assigned", "accepted"].includes(
						foundCase.status,
					)
				) {
					throw new ControllerError(
						409,
						`Cannot reassign a case with status ${foundCase.status}.`,
					);
				}
			}

			if (status === "assigned") {
				if (foundCase.status === "suspended") {
					if (currentUser.role !== "super-admin") {
						throw new ControllerError(
							403,
							"Only a super-admin may reassign a suspended case.",
						);
					}
				} else {
					if (
						!["payment-validated", "assigned", "accepted"].includes(
							foundCase.status,
						)
					) {
						throw new ControllerError(
							409,
							`Cannot assign a case with status ${foundCase.status}.`,
						);
					}

					if (!isAssignmentRole) {
						throw new ControllerError(
							403,
							"Only a super-admin, admin, or manager may assign or reassign a case.",
						);
					}
				}

				const foundStaffMember = await User.findOne({ id: assigneeId })
					.session(session)
					.exec();

				if (!foundStaffMember) {
					throw new ControllerError(404, "Staff member not found.");
				}
			}

			if (status === "accepted") {
				if (foundCase.status !== "assigned") {
					throw new ControllerError(
						409,
						`A case can only be accepted when its status is assigned. Current status: ${foundCase.status}.`,
					);
				}

				if (foundCase.assigneeId !== currentUser.id) {
					throw new ControllerError(
						403,
						"Only the assigned staff member may accept responsibility for the case.",
					);
				}
			}

			if (status === "closed") {
				if (foundCase.status !== "under-review") {
					throw new ControllerError(
						409,
						`A case can only be closed when its status is under-review. Current status: ${foundCase.status}.`,
					);
				}

				if (currentUser.role !== "super-admin") {
					throw new ControllerError(
						403,
						"Only a super-admin may close a case.",
					);
				}
			}

			if (status === "disputed") {
				if (foundCase.status !== "closed") {
					throw new ControllerError(
						409,
						`A case with status ${foundCase.status} cannot be disputed.`,
					);
				}

				const openDispute = await Dispute.findOne({
					caseId,
					status: "open",
				})
					.session(session)
					.exec();

				if (!openDispute) {
					throw new ControllerError(
						409,
						"No open dispute exists for this case.",
					);
				}

				// include assigned staff manager's id to condition when we have that set up
				if (foundCase.assigneeId !== currentUser.id) {
					throw new ControllerError(
						403,
						"Only the assigned staff member may accept the dispute.",
					);
				}
			}

			const updateData = {
				...(status !== undefined ? { status } : {}),
				...(assigneeId !== undefined ? { assigneeId } : {}),
			};

			const updateOperation = {
				$set: updateData,
				$push: {
					statusHistory: {
						status: status ?? foundCase.status,
						changedAt: new Date(),
						// For assignment actions this is the target assignee.
						// For other status actions this is the acting user.
						assigneeId: assigneeId ?? currentUser.id,
					},
				},
			};

			const caseQuery = {
				id: caseId,
				status: foundCase.status,
				assigneeId: foundCase.assigneeId,
			};

			updatedCase = await Case.findOneAndUpdate(caseQuery, updateOperation, {
				session,
				returnDocument: "after",
				runValidators: true,
			}).exec();

			if (!updatedCase) {
				throw new ControllerError(
					409,
					"The case changed before the update could be applied. Reload it and try again.",
				);
			}

			if (status === "disputed") {
				const acceptedDispute = await Dispute.findOneAndUpdate(
					{ caseId, status: "open" },
					{ $set: { status: "accepted" } },
					{
						session,
						returnDocument: "after",
						runValidators: true,
					},
				).exec();

				if (!acceptedDispute) {
					throw new ControllerError(
						409,
						"The open dispute changed before it could be accepted. Reload and try again.",
					);
				}
			}
		});

		return res.status(200).json({
			status: "success",
			message: "Case updated successfully.",
			data: updatedCase,
		});
	} catch (error) {
		if (error instanceof ControllerError) {
			return res.status(error.statusCode).json({
				status: "fail",
				message: error.message,
			});
		}

		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue while updating this case. Please retry.",
		});
	} finally {
		await session.endSession();
	}
};

export default updateCase;
