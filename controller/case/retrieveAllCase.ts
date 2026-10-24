import type { Request, Response } from "express";
import Case from "../../model/case.ts";

const retrieveAllCase = async (req: Request, res: Response) => {
	const currentUser = (
		req as Request & {
			user?: { id: string; role: string; type: string; email: string };
		}
	).user;
	const { filter, page, perPage } = req.query || {};

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
		type CaseStatus = (typeof allowableStatuses)[number];

		const requestedStatuses = Array.isArray(filter)
			? filter.filter((value): value is string => typeof value === "string")
			: typeof filter === "string"
				? [filter]
				: allowableStatuses;
		const validStatuses = requestedStatuses.filter(
			(value): value is CaseStatus =>
				allowableStatuses.includes(value as CaseStatus),
		);
		const statusFilter = {
			$in: validStatuses.length ? validStatuses : allowableStatuses,
		};
		const unassignedStatuses = ["submitted", "payment-validated"] as const;
		const query = {
			status: statusFilter,
			...(currentUser &&
			["registered-client", "guest-client"].includes(currentUser.type)
				? { applicantEmail: currentUser.email }
				: {}),
			...(currentUser && currentUser.role !== "super-admin"
				? {
						$or: [
							{ status: { $in: unassignedStatuses } },
							{
								status: { $nin: unassignedStatuses }, //include assigned staff manager's id to array when we have that set up.
								"statusHistory.assigneeId": { $in: [currentUser.id] },
							},
						],
					}
				: {}),
		};

		const pageNumber = Math.max(Number(page) || 1, 1);
		const limit = Math.max(Number(perPage) || 10, 1);
		const skip = (pageNumber - 1) * limit;
		const total = await Case.countDocuments(query);

		const cases = await Case.find(query).skip(skip).limit(limit).lean().exec();
		if (!(cases.length > 0)) {
			return res.status(404).json({
				status: "success",
				message: "Cases not found",
			});
		}

		return res.status(200).json({
			status: "success",
			message: "success",
			data: cases,
			meta: {
				page: pageNumber,
				perPage: limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in retrieving cases at this moment. Please retry",
		});
	}
};

export default retrieveAllCase;
