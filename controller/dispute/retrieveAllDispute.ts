import type { Request, Response } from "express";
import Dispute from "../../model/dispute.ts";

const retrieveAllDispute = async (req: Request, res: Response) => {
	const { caseId } = req.params || {};
	if (!caseId) {
		return res.status(400).json({
			status: "fail",
			message: "Case Id not found, Cannot Proceed",
		});
	}

	try {
		const query = { caseId };
		const disputes = await Dispute.find(query);
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
