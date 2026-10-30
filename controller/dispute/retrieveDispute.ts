import type { Request, Response } from "express";
import Dispute from "../../model/dispute.ts";

const retrieveDispute = async (req: Request, res: Response) => {
	const { disputeId } = req.params || {};
	if (!disputeId) {
		return res.status(400).json({
			status: "fail",
			message: "Case Id not found, Cannot Proceed",
		});
	}

	try {
		const query = { id: disputeId };
		const foundDispute = await Dispute.findOne(query);
		if (!foundDispute) {
			return res.status(404).json({
				status: "fail",
				message: "Case dispute not found",
			});
		}

		return res.status(200).json({
			status: "success",
			message: "success",
			data: foundDispute,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in retrieving case dispute at this moment. Please retry",
		});
	}
};

export default retrieveDispute;
