import type { Request, Response } from "express";
import Case from "../../model/case.ts";

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

		return res.status(200).json({
			status: "success",
			message: "Case tracking details retrieved successfully.",
			data: caseDetail,
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
