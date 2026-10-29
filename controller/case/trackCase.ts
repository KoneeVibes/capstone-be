import type { Request, Response } from "express";
import Case from "../../model/case.ts";
import User from "../../model/user.ts";

const trackCase = async (req: Request, res: Response) => {
	const { trackingId } = req.params || {};
	if (!trackingId) {
		return res.status(400).json({
			status: "fail",
			message: "Case Id not found, Cannot Proceed",
		});
	}

	try {
		const caseDetail = await Case.findOne(
			{ trackingId },
			{
				trackingId: 1,
				status: 1,
				statusHistory: 1,
				updatedAt: 1,
				propertyAddress: 1,
			},
		)
			.lean()
			.exec();
		if (!caseDetail) {
			return res.status(404).json({
				status: "fail",
				message: "Case not found.",
			});
		}

		const assigneeIds = [
			...new Set(
				caseDetail.statusHistory
					.map((record) => record.assigneeId)
					.filter((id): id is string => Boolean(id)),
			),
		];

		const users = assigneeIds.length
			? await User.find(
					{ id: { $in: assigneeIds } },
					{ id: 1, firstName: 1, lastName: 1, _id: 0 },
				)
					.lean()
					.exec()
			: [];
		const usersById = new Map(users.map((user) => [user.id, user]));

		const statusHistory = caseDetail.statusHistory.map((record) => {
			if (!record.assigneeId) {
				return { ...record, assigneeName: null };
			}
			const assignee = usersById.get(record.assigneeId);
			const assigneeName = assignee
				? [assignee.firstName, assignee.lastName].filter(Boolean).join(" ") ||
					null
				: null;
			return { ...record, assigneeName };
		});

		return res.status(200).json({
			status: "success",
			message: "Case tracking details retrieved successfully.",
			data: { ...caseDetail, statusHistory },
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message: "Unable to retrieve case tracking details. Please retry.",
		});
	}
};

export default trackCase;
