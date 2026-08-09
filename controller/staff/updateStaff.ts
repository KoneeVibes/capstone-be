import User from "../../model/user.ts";
import { v2 as cloudinary } from "cloudinary";
import type { Request, Response } from "express";

const updateStaff = async (req: Request, res: Response) => {
	const { path } = req.file || {};
	const { userId } = req.params || {};
	const { firstName, middleName, lastName, email, phone, role } =
		req.body || {};

	if (!userId) {
		return res.status(400).json({
			status: "fail",
			message: "User Id not found, Cannot Proceed",
		});
	}

	try {
		const query = { id: userId, type: "staff", status: "active" } as const;

		const foundStaffMember = await User.findOne(query);
		if (!foundStaffMember) {
			return res.status(404).json({
				status: "fail",
				message: "Staff member not found.",
			});
		}
		const oldAvatar = foundStaffMember?.avatar;

		const updateData = {
			firstName,
			middleName,
			lastName,
			email,
			phone,
			role,
			...(path ? { avatar: path } : {}),
		};
		const updatedStaffMember = await User.findOneAndUpdate(query, updateData, {
			new: true,
		});
		if (!updatedStaffMember) {
			return res.status(404).json({
				status: "fail",
				message: "Staff member not found.",
			});
		}

		if (path && oldAvatar) {
			const oldAvatarId = oldAvatar?.split("/")?.pop()?.split(".")[0];
			await cloudinary.uploader.destroy(`avatar/${oldAvatarId}`);
		}

		res.status(200).json({
			status: "success",
			message: "Staff member updated successfully.",
			data: updatedStaffMember,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in updating this staff member. Please retry",
		});
	}
};

export default updateStaff;
