import jwt from "jsonwebtoken";
import User from "../model/user.ts";
import type { NextFunction, Request, Response } from "express";
import { tokenBlacklist } from "../controller/authentication/signout.ts";

export default async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			res.status(401).json({
				status: "fail",
				message: "Authorization header missing",
			});
			return;
		}
		const token = authHeader.split(" ")[1];
		if (!token) {
			res.status(404).json({
				status: "fail",
				message: "Token is missing in authorization header",
			});
			return;
		}
		if (tokenBlacklist.has(token)) {
			res.status(401).json({
				status: "fail",
				message: "Token is blacklisted",
			});
			return;
		}
		let decodedToken;
		const secretKey = process.env.JWT_SECRET_KEY;
		if (!secretKey) {
			res.status(500).json({
				status: "fail",
				message: "Paystack secret key is not configured.",
			});
			return;
		}
		try {
			decodedToken = jwt.verify(token, secretKey) as jwt.JwtPayload;
		} catch (err) {
			res.status(401).json({
				status: "fail",
				message: "Invalid or expired token",
			});
			return;
		}
		const user = await User.findById(decodedToken.id);
		if (!user) {
			res.status(404).json({
				status: "fail",
				message: "Account not found",
			});
			return;
		}
		(req as Request & { user: typeof user }).user = user;
		next();
	} catch (error) {
		res.status(500).json({
			status: "fail",
			message:
				"Server encountered an error in authorizing user action. Contact Administrator",
		});
		return;
	}
};
