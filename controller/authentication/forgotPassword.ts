import type { Request, Response } from "express";
import User from "../../model/user.ts";
import OTP from "../../model/otp.ts";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendEmail from "../../util/notification/nodemailer/emailSender.ts";
import { forgotPasswordSupportTemplate } from "../../view/authentication/forgotPasswordSupport.ts";

const forgotPassword = async (req: Request, res: Response) => {
	const { email } = req.body || {};
	if (!email) {
		return res.status(400).json({
			status: "fail",
			message: "User email not found, cannot proceed",
		});
	}

	try {
		const existingUser = await User.findOne({ email, status: "active" });
		if (!existingUser) {
			return res.status(409).json({
				status: "fail",
				message: "Invalid email, please retry",
			});
		}

		const foundOTP = await OTP.findOne({ requester: email });
		if (foundOTP) {
			return res.status(409).json({
				status: "fail",
				message:
					"An OTP has already been sent to this email. Please try again after 10 minutes.",
			});
		}

		const randomSixDigits = crypto.randomInt(100000, 999999).toString();
		const hashedOTP = await bcrypt.hash(randomSixDigits, 10);
		const otpId = uuidv4();
		const otp = new OTP({
			id: otpId,
			requester: email,
			type: "password-reset",
			password: hashedOTP,
			expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
		});
		await otp.save();

		const templateConfig = {
			customerName: `${existingUser?.firstName} ${existingUser?.lastName}`,
			otp: randomSixDigits,
		};
		const html = forgotPasswordSupportTemplate(templateConfig);
		const mailConfig = {
			email,
			html,
			subject: `Password Reset Request — OTP`,
		};
		await sendEmail(mailConfig);

		return res.status(201).json({
			status: "success",
			message: "Password reset OTP sent successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in sending forgot password OTP to this customer. Please retry",
		});
	}
};

export default forgotPassword;
