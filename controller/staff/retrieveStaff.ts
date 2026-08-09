import type { Request, Response } from "express";
import User from "../../model/user.ts";

const retrieveStaff = async (req: Request, res: Response) => {
	const { userId } = req.params || {};
	if (!userId) {
		return res.status(400).json({
			status: "fail",
			message: "User Id not found, Cannot Proceed",
		});
	}

	try {
		const staffMember = await User.findOne({
			id: userId,
			type: "staff",
			status: "active",
		}).select("-password");
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
				"Server encountered an issue in retrieving staff memberat this moment. Please retry",
		});
	}
};

export default retrieveStaff;
