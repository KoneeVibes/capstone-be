import type { Request, Response } from "express";
import Search from "../../model/search.ts";

type AuthenticatedUser = {
	id: string;
};

const retrieveSearchHistory = async (req: Request, res: Response) => {
	const currentUser = (req as Request & { user?: AuthenticatedUser }).user;
	if (!currentUser) {
		return res.status(401).json({
			status: "fail",
			message: "Authentication is required.",
		});
	}

	const { page, perPage } = req.query || {};
	const pageNumber = Math.max(Number(page) || 1, 1);
	const limit = Math.min(Math.max(Number(perPage) || 10, 1), 100);
	const skip = (pageNumber - 1) * limit;

	try {
		const query = { requester: currentUser.id, status: "active" } as const;

		const [total, searches] = await Promise.all([
			Search.countDocuments(query).exec(),
			Search.find(query)
				.select("-key -_id -__v")
				.sort({ updatedAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean()
				.exec(),
		]);

		return res.status(200).json({
			status: "success",
			message: "Search history retrieved successfully.",
			data: searches,
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
				"Server encountered an issue retrieving search history. Please retry.",
		});
	}
};

export default retrieveSearchHistory;
