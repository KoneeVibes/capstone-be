import type { Request, Response } from "express";
import Case from "../../model/case.ts";

const updateCase = async (req: Request, res: Response) => {
	const { caseId } = req.params || {};
	const { status, assigneeId } = req.body || {};

	if (!caseId) {
		return res.status(400).json({
			status: "fail",
			message: "Case Id not found, Cannot Proceed",
		});
	}

	if (!status && !assigneeId) {
		return res.status(400).json({
			status: "fail",
			message: "Neither status nor assignee was found, Cannot Proceed",
		});
	}

	const allowableStatuses = [
		"submitted",
		"assigned",
		"accepted",
		"pending-information",
		"under-review",
		"closed",
	] as const;
	if (status && ![...allowableStatuses, "suspended"].includes(status)) {
		return res.status(400).json({
			status: "fail",
			message: "Invalid status, Cannot Proceed",
		});
	}

	try {
		const query = { id: caseId, status: { $in: allowableStatuses } };
		const updateData = {
			...(status !== undefined ? { status } : {}),
			...(assigneeId !== undefined ? { assigneeId } : {}),
		};

		const updatedCase = await Case.findOneAndUpdate(
			query,
			{ $set: updateData },
			{
				returnDocument: "after",
				runValidators: true,
			},
		);
		if (!updatedCase) {
			return res.status(404).json({
				status: "fail",
				message: "Case not found.",
			});
		}

		res.status(200).json({
			status: "success",
			message: "Case updated successfully.",
			data: updatedCase,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in updating this case. Please retry",
		});
	}
};

export default updateCase;
