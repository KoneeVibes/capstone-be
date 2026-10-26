import type { Request, Response } from "express";
import Case from "../../model/case.ts";

const suspendCase = async (req: Request, res: Response) => {
	const { caseId } = req.params || {};
	const currentUser = (
		req as Request & {
			user?: { id: string; role: string; type: string; email: string };
		}
	).user;
	if (!caseId) {
		return res.status(400).json({
			status: "fail",
			message: "Case Id not found, Cannot Proceed",
		});
	}

	try {
		const allowableStatuses = [
			"payment-validated",
			"assigned",
			"accepted",
			"pending-information",
			"under-review",
		] as const;
		const query = { id: caseId, status: { $in: allowableStatuses } };

		const updateData = {
			status: "suspended",
		} as const;

		const updateOperation: Record<string, unknown> = {
			$set: updateData,
		};

		updateOperation.$push = {
			statusHistory: {
				status: "suspended",
				changedAt: new Date(),
				assigneeId: currentUser?.id,
			},
		};

		const suspendedCase = await Case.findOneAndUpdate(query, updateOperation, {
			returnDocument: "after",
			runValidators: true,
		});
		if (!suspendedCase) {
			return res.status(404).json({
				status: "fail",
				message: "Case not found.",
			});
		}

		return res.status(200).json({
			status: "success",
			message: "Case suspended successfully.",
			data: suspendedCase,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in suspending this case. Please retry",
		});
	}
};

export default suspendCase;
