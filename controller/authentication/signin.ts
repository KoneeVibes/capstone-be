import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../model/user.ts";
import "dotenv/config";
import validateRequiredFields from "../../validator/fieldValidator.ts";

const signInUser = async (req: Request, res: Response) => {
	const { email, password } = req.body || {};
	const validationResult = validateRequiredFields({ email, password });
	if (!validationResult.valid) {
		return res.status(400).json({
			status: "fail",
			message: `Incomplete user details, cannot proceed: Missing ${validationResult.missingField}`,
		});
	}

	try {
		const user = await User.findOne({ email: email, status: "active" }).select(
			"+password",
		);
		if (user) {
			const isMatch = user.password
				? await bcrypt.compare(password, user.password)
				: false;
			if (isMatch) {
				const secretKey = process.env.JWT_SECRET_KEY;
				if (!secretKey) {
					res.status(500).json({
						status: "fail",
						message: "Paystack secret key is not configured.",
					});
					return;
				}
				const accessToken = jwt.sign(
					{
						id: user._id,
						type: user.type,
					},
					secretKey,
					{ expiresIn: `${1440}m` },
				);
				return res.status(200).json({
					status: "success",
					token: accessToken,
				});
			} else {
				return res.status(401).json({
					status: "fail",
					message: "Incorrect password",
				});
			}
		} else {
			return res.status(404).json({
				status: "fail",
				message: "User not found",
			});
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in authenticating this user. Please retry",
		});
	}
};

export default signInUser;
