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
		"payment-validated",
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

		const foundCase = await Case.findOne({ id: caseId });
		if (!foundCase) {
			return res.status(404).json({
				status: "fail",
				message: "Case not found",
			});
		}

		const updateOperation: Record<string, unknown> = {
			$set: updateData,
		};

		updateOperation.$push = {
			statusHistory: {
				status: status ? status : foundCase?.status,
				changedAt: new Date(),
				assigneeId: assigneeId ?? null, //when we introduce authorization, we will be able to replace null with the requesting user's id
			},
		};

		const updatedCase = await Case.findOneAndUpdate(query, updateOperation, {
			returnDocument: "after",
			runValidators: true,
		});
		if (!updatedCase) {
			return res.status(404).json({
				status: "fail",
				message: "Case failed to update.",
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
