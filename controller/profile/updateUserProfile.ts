import type { Request, Response } from "express";
import User from "../../model/user.ts";
import { v2 as cloudinary } from "cloudinary";

const updateUserProfile = async (req: Request, res: Response) => {
	const { path } = req.file || {};
	const currentUser = (
		req as Request & {
			user?: { id: string; role: string };
		}
	).user;
	const { firstName, middleName, lastName, phone } = req.body || {};

	if (!currentUser?.id) {
		return res.status(401).json({
			status: "fail",
			message:
				"Authentication is required or the authenticated user ID is missing.",
		});
	}

	try {
		const query = { id: currentUser?.id, status: "active" } as const;

		const foundUser = await User.findOne(query);
		if (!foundUser) {
			return res.status(404).json({
				status: "fail",
				message: "User not found.",
			});
		}
		const oldAvatar = foundUser?.avatar;

		const updateData = {
			...(firstName !== undefined ? { firstName } : {}),
			...(middleName !== undefined ? { middleName } : {}),
			...(lastName !== undefined ? { lastName } : {}),
			...(phone !== undefined ? { phone } : {}),
			...(path ? { avatar: path } : {}),
		};
		if (Object.keys(updateData).length === 0) {
			return res.status(400).json({
				status: "fail",
				message: "Provide at least one field to update.",
			});
		}

		const updatedUser = await User.findOneAndUpdate(
			query,
			{ $set: updateData },
			{
				returnDocument: "after",
				runValidators: true,
			},
		).select("id firstName middleName lastName phone avatar");
		if (!updatedUser) {
			return res.status(404).json({
				status: "fail",
				message: "User not found.",
			});
		}

		if (path && oldAvatar) {
			const oldAvatarId = oldAvatar?.split("/")?.pop()?.split(".")[0];
			await cloudinary.uploader.destroy(`avatar/${oldAvatarId}`);
		}

		return res.status(200).json({
			status: "success",
			message: "User profile updated successfully.",
			data: updatedUser,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in updating this user profile. Please retry",
		});
	}
};

export default updateUserProfile;
