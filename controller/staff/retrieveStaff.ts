import type { Request, Response } from "express";
import User from "../../model/user.ts";

const retrieveStaff = async (req: Request, res: Response) => {
	const currentUser = (
		req as Request & {
			user?: { id: string; role: string };
		}
	).user;
	const { userId } = req.params || {};
	if (!userId) {
		return res.status(400).json({
			status: "fail",
			message: "User Id not found, Cannot Proceed",
		});
	}

	const wideScopedRoles = ["super-admin", "admin", "manager"];
	if (
		userId !== currentUser?.id &&
		!wideScopedRoles.includes(currentUser?.role ?? "")
	) {
		return res.status(403).json({
			status: "fail",
			message: "You are not permitted to access or update this user.",
		});
	}

	try {
		const query = {
			id: userId,
			type: "staff",
			status: "active",
		} as const;

		const staffMember = await User.findOne(query).select("-password");
		if (!staffMember) {
			return res.status(404).json({
				status: "fail",
				message: "Staff member not found.",
			});
		}

		res.status(200).json({
			status: "success",
			message: "success",
			data: staffMember,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in retrieving staff member at this moment. Please retry",
		});
	}
};

export default retrieveStaff;
