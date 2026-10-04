import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import OTP from "../../model/otp.ts";
import User from "../../model/user.ts";
import dbConnect from "../../db/dbConnect.ts";
import validateRequiredFields from "../../validator/fieldValidator.ts";

const verifyOTP = async (req: Request, res: Response) => {
	const { email, otp, otpType, user } = req.body || {};
	const bodyValidationResult = validateRequiredFields({ email, otp });
	if (!bodyValidationResult.valid) {
		return res.status(400).json({
			status: "fail",
			message: `Incomplete Details: Missing ${bodyValidationResult.missingField}`,
		});
	}

	if (!["sign-up", "password-reset"].includes(otpType)) {
		return res.status(400).json({
			status: "fail",
			message: "Invalid OTP type.",
		});
	}

	if (user?.password && user?.confirmPassword) {
		if (user.password !== user.confirmPassword) {
			return res.status(400).json({
				status: "fail",
				message: "Passwords do not match",
			});
		}
	}

	const session = await dbConnect.startSession();
	session.startTransaction();

	try {
		const foundUser = await User.findOne({
			email: email,
			type: { $in: ["staff", "guest-client", "registered-client"] },
		}).session(session);
		if (!foundUser) {
			await session.abortTransaction();
			return res.status(404).json({
				status: "fail",
				message: "User not found. Cannot proceed.",
			});
		}

		if (otpType === "password-reset" && foundUser.status !== "active") {
			await session.abortTransaction();
			return res.status(400).json({
				status: "fail",
				message: "Activate your account before resetting your password.",
			});
		}

		const userValidationResult = validateRequiredFields({
			firstName: foundUser.firstName,
			lastName: foundUser.lastName,
			password: foundUser.password,
		});
		if (
			otpType === "sign-up" &&
			!userValidationResult.valid &&
			(!user?.firstName || !user?.lastName || !user?.password)
		) {
			await session.abortTransaction();
			return res.status(400).json({
				status: "fail",
				message:
					"First name, last name, and password are required to complete signup.",
			});
		}
		if (
			otpType === "password-reset" &&
			(!user?.password || !user?.confirmPassword)
		) {
			await session.abortTransaction();
			return res.status(400).json({
				status: "fail",
				message: "A new password is required.",
			});
		}

		const foundOTP = await OTP.findOne({
			requester: email,
			type: otpType,
			expiresAt: { $gt: new Date() },
		}).session(session);
		if (!foundOTP) {
			await session.abortTransaction();
			return res.status(409).json({
				status: "fail",
				message: "OTP not found. Please try again.",
			});
		}

		const hashedOtp = foundOTP.password;
		const isMatch = await bcrypt.compare(otp, hashedOtp);
		if (!isMatch) {
			await session.abortTransaction();
			return res.status(400).json({
				status: "fail",
				message: "OTP not valid. Please try again",
			});
		}

		// For sign-up OTP, If OTP is valid, update user status to active. Where userValidationResult is false, update user details. Then delete the OTP record.
		if (otpType === "sign-up") {
			foundUser.status = "active";
			if (!userValidationResult.valid) {
				foundUser.firstName = user.firstName;
				foundUser.middleName = user.middleName || null;
				foundUser.lastName = user.lastName;
				foundUser.password = await bcrypt.hash(user.password, 10);
			}
		}
		if (otpType === "password-reset") {
			foundUser.password = await bcrypt.hash(user.password, 10);
		}
		await foundUser.save({ session });

		const deletedOTP = await OTP.findOneAndDelete({ id: foundOTP.id }).session(
			session,
		);
		if (!deletedOTP) {
			await session.abortTransaction();
			return res.status(400).json({
				status: "fail",
				message: "OTP not valid. Please try again",
			});
		}

		await session.commitTransaction();
		return res.status(200).json({
			status: "success",
			message: "OTP is successfully verified",
		});
	} catch (error) {
		console.error(error);
		await session.abortTransaction();
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an error while verifying user authentication OTP. Please retry.",
		});
	} finally {
		await session.endSession();
	}
};

export default verifyOTP;
