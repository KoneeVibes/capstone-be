import isValidString from "../../validator/isValidString.ts";
import Case from "../../model/case.ts";
import Invoice from "../../model/invoice.ts";
import dbConnect from "../../db/dbConnect.ts";
import sendEmail from "../../util/notification/nodemailer/emailSender.ts";
import { paymentAcknowledgementTemplate } from "../../view/invoice/paymentAcknowledgement.ts";

const chargeSuccess = async (event: any) => {
	const { reference, amount, currency } = event || {};

	if (![reference].every(isValidString)) {
		return {
			status: "fail",
			message: "Invalid transaction reference, Cannot Proceed",
		};
	}

	const session = await dbConnect.startSession();
	session.startTransaction();

	try {
		const foundInvoice = await Invoice.findOne({
			transactionReference: reference,
		}).session(session);
		if (!foundInvoice) {
			await session.abortTransaction();
			return {
				status: "fail",
				message: "Invoice not found",
			};
		}
		if (foundInvoice.status === "paid") {
			return {
				status: "success",
				message: "Invoice has already been processed.",
			};
		}

		const foundCase = await Case.findOne({ id: foundInvoice?.caseId }).session(
			session,
		);
		if (!foundCase) {
			await session.abortTransaction();
			return {
				status: "fail",
				message: "Case not found",
			};
		}

		const updatedInvoice = await Invoice.findOneAndUpdate(
			{ transactionReference: reference },
			{ $set: { status: "paid" } },
			{
				session,
				returnDocument: "after",
				runValidators: true,
			},
		);
		if (!updatedInvoice) {
			await session.abortTransaction();
			return {
				status: "fail",
				message: "Invoice failed to update.",
			};
		}

		const updateData = {
			status: "payment-validated",
		} as const;

		const updateOperation: Record<string, unknown> = {
			$set: updateData,
		};

		updateOperation.$push = {
			statusHistory: {
				status: "payment-validated",
				changedAt: new Date(),
				note: "Case validated successfully.",
			},
		};

		const updatedCase = await Case.findOneAndUpdate(
			{ id: foundInvoice?.caseId },
			updateOperation,
			{
				session,
				returnDocument: "after",
				runValidators: true,
			},
		);
		if (!updatedCase) {
			await session.abortTransaction();
			return {
				status: "fail",
				message: "Case failed to update.",
			};
		}

		const templateConfig = {
			customerName: foundCase?.applicantName,
			amount: `${currency}${amount}`,
			paymentReference: reference,
		};
		const html = paymentAcknowledgementTemplate(templateConfig);
		const mailConfig = {
			email: foundCase?.applicantEmail,
			html,
			subject: `Payment Confirmed — ${reference}`,
		};
		await sendEmail(mailConfig);

		await session.commitTransaction();
		return {
			status: "success",
			message: "Invoice and case statuses updated successfully",
		};
	} catch (error) {
		console.error(
			`Server encountered an issue in updating invoice and cases statuses. Please retry ${error}`,
		);
		await session.abortTransaction();
		return {
			status: "fail",
			message:
				"Server encountered an issue with handling the charge.success event",
		};
	} finally {
		await session.endSession();
	}
};

export default chargeSuccess;
