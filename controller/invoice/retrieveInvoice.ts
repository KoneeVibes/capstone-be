import type { Request, Response } from "express";
import Invoice from "../../model/invoice.ts";

const retrieveInvoice = async (req: Request, res: Response) => {
	const { invoiceId } = req.params || {};
	if (!invoiceId) {
		return res.status(400).json({
			status: "fail",
			message: "Invoice Id not found, Cannot Proceed",
		});
	}
	try {
		const invoice = await Invoice.findOne({ id: invoiceId });
		if (!invoice) {
			return res.status(404).json({
				status: "success",
				message: "Invoice not found",
			});
		}
		res.status(200).json({
			status: "success",
			message: "success",
			data: invoice,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in retrieving invoice at this moment. Please retry",
		});
	}
};

export default retrieveInvoice;
