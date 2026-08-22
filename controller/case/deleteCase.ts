import type { Request, Response } from "express";
import Case from "../../model/case.ts";

const deleteCase = async (req: Request, res: Response) => {
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

		const updateData = {
			status: "suspended",
		} as const;

		const deletedCase = await Case.findOneAndUpdate(query, updateData, {
			new: true,
		});
		if (!deletedCase) {
			return res.status(404).json({
				status: "fail",
				message: "Case not found.",
			});
		}

		res.status(200).json({
			status: "success",
			message: "Case deleted successfully.",
			data: deletedCase,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in deleting this case. Please retry",
		});
	}
};

export default deleteCase;
