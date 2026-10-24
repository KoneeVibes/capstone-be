import type { Request, Response } from "express";
import Dispute from "../../model/dispute.ts";
import isValidString from "../../validator/isValidString.ts";

const rejectDispute = async (req: Request, res: Response) => {
	const { disputeId } = req.params;
	const { rejectionNote } = req.body;

	if (![disputeId, rejectionNote].every(isValidString)) {
		return res.status(400).json({
			status: "fail",
			message: "Invalid dispute id or no rejection note found, Cannot Proceed",
		});
	}

	try {
		const query = {
			id: disputeId,
			status: "open",
		} as const;
		const updateData = {
			status: "rejected",
			rejectionNote,
		};
		const rejectedDispute = await Dispute.findOneAndUpdate(
			query,
			{ $set: updateData },
			{
				returnDocument: "after",
				runValidators: true,
			},
		);
		if (!rejectedDispute) {
			return res.status(404).json({
				status: "fail",
				message: "Dispute not found.",
			});
		}

		return res.status(200).json({
			status: "success",
			message: "Dispute rejected successfully.",
			data: rejectedDispute,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue while rejecting this case. Please retry.",
		});
	}
};

export default rejectDispute;
