import type { Request, Response } from "express";
import User from "../../model/user.ts";

const deleteStaff = async (req: Request, res: Response) => {
	const { userId } = req.params || {};
	if (!userId) {
		return res.status(400).json({
			status: "fail",
			message: "User Id not found, Cannot Proceed",
		});
	}

	try {
		const query = {
			id: userId,
			type: "staff",
			status: "active",
		} as const;

		const updateData = {
			status: "inactive",
		} as const;

		const deletedStaffMember = await User.findOneAndUpdate(query, updateData, {
			new: true,
		});
		if (!deletedStaffMember) {
			return res.status(404).json({
				status: "fail",
				message: "Staff member not found.",
			});
		}

		res.status(200).json({
			status: "success",
			message: "Staff member deleted successfully.",
			data: deletedStaffMember,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in deleting this staff member. Please retry",
		});
	}
};

export default deleteStaff;
