import type { Request, Response } from "express";
import User from "../../model/user.ts";

const retrieveUserProfile = async (req: Request, res: Response) => {
	const currentUser = (
		req as Request & {
			user?: { id: string; role: string };
		}
	).user;

	if (!currentUser?.id) {
		return res.status(401).json({
			status: "fail",
			message:
				"Authentication is required or the authenticated user ID is missing.",
		});
	}

	try {
		const query = {
			id: currentUser?.id,
			status: "active",
		} as const;

		const user = await User.findOne(query).select(
			"id firstName middleName lastName phone avatar",
		);
		if (!user) {
			return res.status(404).json({
				status: "fail",
				message: "User not found.",
			});
		}

		return res.status(200).json({
			status: "success",
			message: "success",
			data: user,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in retrieving user profile at this moment. Please retry",
		});
	}
};

export default retrieveUserProfile;
