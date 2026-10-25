import type { Request, Response } from "express";
import Dispute from "../../model/dispute.ts";

const retrieveAllDispute = async (req: Request, res: Response) => {
	const { caseId } = req.params || {};
	const { page, perPage } = req.query || {};

	if (!caseId) {
		return res.status(400).json({
			status: "fail",
			message: "Case Id not found, Cannot Proceed",
		});
	}

	try {
		const query = { caseId };

		const pageNumber = Math.max(Number(page) || 1, 1);
		const limit = Math.max(Number(perPage) || 10, 1);
		const skip = (pageNumber - 1) * limit;

		const total = await Dispute.countDocuments(query).exec();
		const disputes = await Dispute.find(query)
			.skip(skip)
			.limit(limit)
			.lean()
			.exec();
		if (!(disputes.length > 0)) {
			return res.status(404).json({
				status: "fail",
				message: "Case disputes not found",
			});
		}

		return res.status(200).json({
			status: "success",
			message: "success",
			data: disputes,
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
				"Server encountered an issue in retrieving case disputes at this moment. Please retry",
		});
	}
};

export default retrieveAllDispute;
