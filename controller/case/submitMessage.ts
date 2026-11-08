import { v4 as uuidv4 } from "uuid";
import Case from "../../model/case.ts";
import type { Request, Response } from "express";

const submitMessage = async (req: Request, res: Response) => {
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

	const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
	if (!text) {
		return res.status(400).json({
			status: "fail",
			message: "A non-empty message text is required.",
		});
	}

	try {
		const foundCase = await Case.findOne({ id: caseId })
			.select("conversation")
			.lean()
			.exec();
		if (!foundCase) {
			return res.status(404).json({
				status: "fail",
				message: "Case not found.",
			});
		}
		if (foundCase.conversation?.status !== "open") {
			return res.status(409).json({
				status: "fail",
				message: "The case conversation is closed. Cannot submit a message.",
			});
		}

		const existingMessageIds = new Set(
			(foundCase.conversation.chat ?? []).map((message) => message.id),
		);
		let messageId = uuidv4();
		while (existingMessageIds.has(messageId)) {
			messageId = uuidv4();
		}

		const sentAt = new Date();
		const message = {
			id: messageId,
			senderId: currentUser.id,
			text,
			sentAt,
			updatedAt: sentAt,
		};

		const updatedCase = await Case.findOneAndUpdate(
			{
				id: caseId,
				"conversation.status": "open",
				"conversation.chat.id": { $ne: messageId },
			},
			{
				$push: {
					"conversation.chat": message,
				},
			},
			{
				returnDocument: "after",
				runValidators: true,
			},
		)
			.select("id trackingId conversation")
			.exec();
		if (!updatedCase) {
			const currentCase = await Case.findOne({ id: caseId })
				.select("conversation.status")
				.lean()
				.exec();
			if (!currentCase) {
				return res.status(404).json({
					status: "fail",
					message: "Case not found.",
				});
			}
			if (currentCase.conversation?.status !== "open") {
				return res.status(409).json({
					status: "fail",
					message: "The case conversation is closed. Cannot submit a message.",
				});
			}
			return res.status(409).json({
				status: "fail",
				message: "The case changed while submitting the message. Please retry.",
			});
		}

		return res.status(201).json({
			status: "success",
			message: "Message submitted successfully.",
			data: {
				caseId: updatedCase.id,
				message,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in submitting this message. Please contact the administrator for assistance.",
		});
	}
};

export default submitMessage;
