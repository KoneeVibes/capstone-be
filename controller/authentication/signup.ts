import type { Request, Response } from "express";
import OTP from "../../model/otp.ts";
import RegisteredClient from "../../model/user.ts";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "../../db/dbConnect.ts";
import validateRequiredFields from "../../validator/fieldValidator.ts";
import isValidString from "../../validator/isValidString.ts";
import sendEmail from "../../util/notification/resend/emailSender.ts";
import { accountCreationNotificationTemplate } from "../../view/authentication/accountCreationNotification.ts";

const signUpUser = async (req: Request, res: Response) => {
	const {
		firstName,
		middleName,
		lastName,
		email,
		password,
		phone,
		organization,
	} = req.body || {};

	const validationResult = validateRequiredFields({
		firstName,
		lastName,
		email,
		password,
	});
	if (!validationResult.valid) {
		return res.status(400).json({
			status: "fail",
			message: `Incomplete User Details: Missing ${validationResult.missingField}`,
		});
	}

	if (
		[middleName, phone, organization].some(
			(field) => field != null && field !== "" && !isValidString(field),
		)
	) {
		return res.status(400).json({
			status: "fail",
			message: "Ensure all fields are valid strings, Cannot Proceed",
		});
	}

	const session = await dbConnect.startSession();
	session.startTransaction();

	try {
		const randomSixDigits = crypto.randomInt(100000, 999999).toString();
		const hashedOTP = await bcrypt.hash(randomSixDigits, 10);
		const otpId = uuidv4();

		const existingClient = await RegisteredClient.findOne({ email }).session(
			session,
		);
		if (existingClient && existingClient?.status === "inactive") {
			const foundOTP = await OTP.findOne({ requester: email }).session(session);
			if (foundOTP) {
				await session.abortTransaction();
				return res.status(409).json({
					status: "fail",
					message:
						"An OTP has already been sent to this email. Please verify your email.",
				});
			} else {
				const otp = new OTP({
					id: otpId,
					requester: email,
					type: "sign-up",
					password: hashedOTP,
					expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
				});
				await otp.save({ session });

				const templateConfig = {
					customerEmail: email,
					customerName: `${firstName} ${lastName}`,
					otp: randomSixDigits,
					autoCreation: false,
				};
				const html = accountCreationNotificationTemplate(templateConfig);
				const mailConfig = {
					email,
					html,
					subject: `Activate Your PropertyIntel Account — OTP`,
				};
				await sendEmail(mailConfig);

				await session.commitTransaction();
				return res.status(200).json({
					status: "success",
					message: "OTP sent successfully",
				});
			}
		}

		// If active client already exists, return conflict status
		if (existingClient) {
			await session.abortTransaction();
			return res.status(409).json({
				status: "fail",
				message: "A client with this email already exists.",
			});
		}

		const clientId = uuidv4();
		const client = new RegisteredClient({
			id: clientId,
			firstName,
			middleName,
			lastName,
			email,
			phone,
			organization,
			password,
			type: "registered-client",
		});
		await client.save({ session });

		const otp = new OTP({
			id: otpId,
			requester: email,
			type: "sign-up",
			password: hashedOTP,
			expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
		});
		await otp.save({ session });

		const templateConfig = {
			customerEmail: email,
			customerName: `${firstName} ${lastName}`,
			otp: randomSixDigits,
			autoCreation: false,
		};
		const html = accountCreationNotificationTemplate(templateConfig);
		const mailConfig = {
			email,
			html,
			subject: `Activate Your PropertyIntel Account — OTP`,
		};
		await sendEmail(mailConfig);

		await session.commitTransaction();
		return res.status(201).json({
			status: "success",
			message: "Registered client created and OTP sent successfully",
		});
	} catch (error) {
		console.error(error);
		await session.abortTransaction();
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an error while creating the user. Please retry.",
		});
	} finally {
		await session.endSession();
	}
};

export default signUpUser;
