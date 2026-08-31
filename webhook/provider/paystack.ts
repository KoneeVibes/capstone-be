import crypto from "crypto";
import dispatchEvent from "../dispatch/paystack.ts";
import type { Request, Response } from "express";

const paystack = async (req: Request, res: Response) => {
	try {
		const secretKey = process.env.PAYSTACK_SECRET_KEY;
		if (!secretKey) {
			return res.status(500).json({
				status: "fail",
				message: "Paystack secret key is not configured.",
			});
		}

		const signature = req.headers["x-paystack-signature"];
		const paystackSignature = Array.isArray(signature)
			? signature[0]
			: signature;

		const hash = crypto
			.createHmac("sha512", secretKey)
			.update(JSON.stringify(req.body))
			.digest("hex");
		if (hash !== paystackSignature) {
			return res.status(401).json({
				status: "fail",
				message: "Invalid Paystack signature.",
			});
		}

		const event = req.body;
		const dispatch = await dispatchEvent(event.event, event.data);
		if (dispatch?.status === "fail") {
			return res.status(500).json({
				status: "fail",
				message: dispatch?.message,
			});
		}

		return res.status(200).json({
			status: "success",
			message: dispatch?.message,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message: "Webhook processing failed.",
		});
	}
};

export default paystack;
