import type { Request, Response } from "express";
import User from "../../model/user.ts";

const retrieveAllStaff = async (req: Request, res: Response) => {
	const { page, perPage } = req.query || {};

	const query = { type: "staff", status: "active" } as const;

	const pageNumber = Math.max(Number(page) || 1, 1);
	const limit = Math.max(Number(perPage) || 10, 1);
	const skip = (pageNumber - 1) * limit;

	try {
		const total = await User.countDocuments(query).exec();

		const staff = await User.find(query)
			.select("-password")
			.skip(skip)
			.limit(limit)
			.lean()
			.exec();
		if (!(staff.length > 0)) {
			return res.status(404).json({
				status: "success",
				message: "Staff not found",
			});
		}

		res.status(200).json({
			status: "success",
			message: "success",
			data: staff,
			meta: {
				page: pageNumber,
				perPage: limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in retrieving staff at this moment. Please retry",
		});
	}
};

export default retrieveAllStaff;
