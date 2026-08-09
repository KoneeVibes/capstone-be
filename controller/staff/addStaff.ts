import { v4 as uuidv4 } from "uuid";
import User from "../../model/user.ts";
import type { Request, Response } from "express";
import isValidString from "../../helper/isValidString.ts";

const addStaff = async (req: Request, res: Response) => {
	const { path } = req.file || {};
	const { firstName, middleName, lastName, email, phone } = req.body;

	if (!firstName || !lastName || !email || !phone) {
		return res.status(400).json({
			status: "fail",
			message:
				"Required fields are missing - First Name, Last Name, Email, Phone. Cannot Proceed.",
		});
	}

	if (![firstName, lastName, email, phone].every(isValidString)) {
		return res.status(400).json({
			status: "fail",
			message: "Ensure all fields are valid strings, Cannot Proceed",
		});
	}

	try {
		const existingStaff = await User.findOne({ email: email, type: "staff" });
		if (existingStaff) {
			return res.status(409).json({
				status: "fail",
				message: "Staff member with this email already exists.",
			});
		}

		const defaultPIN = "Password@123"; // Default password for new staff members. This should be changed upon first login.
		const staff = new User({
			id: uuidv4(),
			firstName,
			middleName,
			lastName,
			email,
			phone,
			avatar: path,
			type: "staff",
			password: defaultPIN,
		});
		const savedStaff = await staff.save();
		if (!savedStaff) {
			return res.status(500).json({
				status: "fail",
				message: "Failed to save the new staff member. Please try again.",
			});
		}

		return res.status(201).json({
			status: "success",
			message: "Staff successfully added",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in adding this staff member. Please contact the administrator for assistance.",
		});
	}
};

export default addStaff;
