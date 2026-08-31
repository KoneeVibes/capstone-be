import type { Request, Response } from "express";
import Case from "../../model/case.ts";
import Invoice from "../../model/invoice.ts";
import dbConnect from "../../db/dbConnect.ts";
import initializeTransaction from "../../util/payment/paystack/initializeTransaction.ts";

const settleInvoice = async (req: Request, res: Response) => {
	const { invoiceId } = req.params || {};
	if (!invoiceId) {
		return res.status(400).json({
			status: "fail",
			message: "Invoice Id not found, Cannot Proceed",
		});
	}

	const session = await dbConnect.startSession();
	session.startTransaction();
	try {
		const foundInvoice = await Invoice.findOne({ id: invoiceId }).session(
			session,
		);
		if (!foundInvoice) {
			await session.abortTransaction();
			return res.status(404).json({
				status: "success",
				message: "Invoice not found",
			});
		}

		const foundCase = await Case.findOne({ id: foundInvoice?.caseId }).session(
			session,
		);
		if (!foundCase) {
			await session.abortTransaction();
			return res.status(404).json({
				status: "success",
				message: "Case not found",
			});
		}

		const transactionParams = {
			email: foundCase?.applicantEmail,
			amount: foundInvoice?.totalPayable,
		};
		const transaction = await initializeTransaction(transactionParams);
		if (!transaction.status) {
			await session.abortTransaction();
			return res.status(404).json({
				status: "fail",
				message:
					"Transaction failed to initialize. Please contact administrator.",
			});
		}
		const accessCode = transaction?.data.access_code;
		const reference = transaction?.data.reference;

		const updatedInvoice = await Invoice.findOneAndUpdate(
			{ id: invoiceId },
			{
				$set: {
					transactionAccessCode: accessCode,
					transactionReference: reference,
				},
			},
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

		await session.commitTransaction();
		res.status(200).json({
			status: "success",
			message: "settlement transaction has been initialized successfully",
			data: {
				accessCode,
				reference,
			},
		});
	} catch (error) {
		console.error(error);
		await session.abortTransaction();
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in retrieving invoice at this moment. Please retry",
		});
	} finally {
		await session.endSession();
	}
};

export default settleInvoice;
