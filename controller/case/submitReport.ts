import type { Request, Response } from "express";
import Case from "../../model/case.ts";
import { v2 as cloudinary } from "cloudinary";

const submitCaseReport = async (req: Request, res: Response) => {
	const files = req.files as
		| { inquiryReport?: Express.Multer.File[] }
		| undefined;
	const attachment = files?.inquiryReport?.map((file) => file.path) ?? [];
	const { caseId } = req.params;
	const currentUser = (
		req as Request & {
			user?: { id: string; role: string; type: string; email: string };
		}
	).user;

	if (!caseId || !currentUser?.id) {
		return res.status(400).json({
			status: "fail",
			message: "Case ID or authenticated user was not found. Cannot proceed.",
		});
	}
	if (!Array.isArray(attachment) || attachment.length < 1) {
		return res.status(400).json({
			status: "fail",
			message: "Attachment not found. Cannot proceed.",
		});
	}

	try {
		const query = {
			id: caseId,
			status: {
				$in: ["accepted", "under-review", "disputed"],
			},
			assigneeId: { $in: [currentUser?.id] }, // remove this field only if currentUser?.id is assigned staff manager's id when we have that set-up
		} as const;

		const foundCase = await Case.findOne(query);
		if (!foundCase) {
			return res.status(404).json({
				status: "fail",
				message: "Case not found.",
			});
		}
		const previousCaseReport = foundCase?.inquiryReport;

		const updateData = {
			inquiryReport: attachment,
			status: "under-review",
		};
		const updateOperation: Record<string, unknown> = {
			$set: updateData,
		};
		updateOperation.$push = {
			statusHistory: {
				status: "under-review",
				changedAt: new Date(),
				assigneeId: currentUser?.id,
			},
		};

		const updatedCase = await Case.findOneAndUpdate(query, updateOperation, {
			returnDocument: "after",
			runValidators: true,
		});
		if (!updatedCase) {
			return res.status(404).json({
				status: "fail",
				message: "Case report could not be submitted.",
			});
		}

		const hasPreviousCaseReport =
			Array.isArray(previousCaseReport) && previousCaseReport.length > 0;
		if (hasPreviousCaseReport && Array.isArray(previousCaseReport)) {
			await Promise.all(
				previousCaseReport.map(async (doc) => {
					if (typeof doc !== "string") return;
					const cloudinaryId = doc.split("/").pop()?.split(".")[0];
					if (!cloudinaryId) return;
					await cloudinary.uploader.destroy(`case report/${cloudinaryId}`);
				}),
			);
		}

		return res.status(200).json({
			status: "success",
			message: "Case report submitted successfully.",
			data: updatedCase,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in submitting case report. Please retry",
		});
	}
};

export default submitCaseReport;
