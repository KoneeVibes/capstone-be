import { v4 as uuidv4 } from "uuid";
import Case from "../../model/case.ts";
import Dispute from "../../model/dispute.ts";
import type { Request, Response } from "express";
import validateRequiredFields from "../../validator/fieldValidator.ts";

const initiateDispute = async (req: Request, res: Response) => {
	const files = req.files as { attachment?: Express.Multer.File[] } | undefined;
	const attachment = files?.attachment?.map((file) => file.path) ?? [];
	const { caseId, title, description } = req.body;
	const currentUser = (
		req as Request & {
			user?: { type: string; email: string };
		}
	).user;

	const validationResult = validateRequiredFields({
		caseId,
		title,
		description,
	});
	if (!validationResult.valid) {
		return res.status(400).json({
			status: "fail",
			message: `Incomplete Dispute Details: Missing ${validationResult.missingField}`,
		});
	}

	if (currentUser && !["registered-client"].includes(currentUser?.type)) {
		return res.status(400).json({
			status: "fail",
			message:
				"Dispute can only be initiated by a registered-client, Cannot Proceed",
		});
	}

	try {
		const allowableStatuses = ["closed"] as const;
		const query = {
			id: caseId,
			applicantEmail: currentUser?.email,
			status: { $in: allowableStatuses },
		};

		const foundCase = await Case.findOne(query);
		if (!foundCase) {
			return res.status(404).json({
				status: "fail",
				message: "Case not found.",
			});
		}

		const foundDispute = await Dispute.findOne({ caseId, status: "open" });
		if (foundDispute) {
			return res.status(409).json({
				status: "fail",
				message: "A case may have only one open dispute per time",
			});
		}

		const disputeId = uuidv4();
		const newDispute = new Dispute({
			id: disputeId,
			caseId,
			title,
			description,
			attachment,
		});
		const savedCase = await newDispute.save();
		if (!savedCase) {
			throw new Error("Failed to save the new dispute. Please try again.");
		}

		return res.status(201).json({
			status: "success",
			message: "Dispute successfully initiated",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in initializing this dispute. Please contact the administrator for assistance.",
		});
	}
};

export default initiateDispute;
