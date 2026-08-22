import type { Request, Response } from "express";
import Case from "../../model/case.ts";

const retrieveCase = async (req: Request, res: Response) => {
	const { caseId } = req.params || {};
	if (!caseId) {
		return res.status(400).json({
			status: "fail",
			message: "Case Id not found, Cannot Proceed",
		});
	}

	try {
		const allowableStatuses = [
			"submitted",
			"assigned",
			"accepted",
			"pending-information",
			"under-review",
			"closed",
		] as const;
		const query = { id: caseId, status: { $in: allowableStatuses } };

		const caseDetail = await Case.findOne(query);
		if (!caseDetail) {
			return res.status(404).json({
				status: "fail",
				message: "Case not found.",
			});
		}

		res.status(200).json({
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
