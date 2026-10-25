import type { Request, Response } from "express";
import Case from "../../model/case.ts";

const retrieveCase = async (req: Request, res: Response) => {
	const { caseId } = req.params || {};
	const currentUser = (
		req as Request & {
			user?: { id: string; role: string; type: string; email: string };
		}
	).user;
	if (!caseId) {
		return res.status(400).json({
			status: "fail",
			message: "Case Id not found, Cannot Proceed",
		});
	}

	try {
		const allowableStatuses = [
			"submitted",
			"payment-validated",
			"assigned",
			"accepted",
			"pending-information",
			"under-review",
			"closed",
			"suspended",
			"disputed",
		] as const;

		const unassignedStatuses = ["submitted", "payment-validated"] as const;
		const query = {
			id: caseId,
			status: { $in: allowableStatuses },
			...(currentUser &&
			["registered-client", "guest-client"].includes(currentUser.type)
				? { applicantEmail: currentUser.email }
				: {}),
			...(currentUser &&
			!["registered-client", "guest-client"].includes(currentUser.type) &&
			currentUser.role !== "super-admin"
				? {
						$or: [
							{ status: { $in: unassignedStatuses } },
							{
								status: { $nin: unassignedStatuses },
								"statusHistory.assigneeId": { $in: [currentUser.id] }, //include assigned staff manager's id to array when we have that set up.
							},
						],
					}
				: {}),
		};

		const caseDetail = await Case.findOne(query);
		if (!caseDetail) {
			return res.status(404).json({
				status: "fail",
				message: "Case not found.",
			});
		}

		return res.status(200).json({
			status: "success",
			message: "success",
			data: caseDetail,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in retrieving case at this moment. Please retry",
		});
	}
};

export default retrieveCase;
