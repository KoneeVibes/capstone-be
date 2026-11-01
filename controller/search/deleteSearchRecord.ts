import type { Request, Response } from "express";
import Search from "../../model/search.ts";

type AuthenticatedUser = {
	id: string;
};

const deleteSearchRecord = async (req: Request, res: Response) => {
	const { searchId } = req.params || {};
	const currentUser = (req as Request & { user?: AuthenticatedUser }).user;

	if (!currentUser) {
		return res.status(401).json({
			status: "fail",
			message: "Authentication is required.",
		});
	}
	if (!searchId) {
		return res.status(400).json({
			status: "fail",
			message: "Search Id not found, Cannot Proceed",
		});
	}

	try {
		const query = { id: searchId, requester: currentUser.id };

		const deletedSearch = await Search.findOneAndUpdate(
			query,
			{ $set: { status: "inactive" } },
			{ new: true },
		).exec();
		if (!deletedSearch) {
			return res.status(404).json({
				status: "fail",
				message: "Search record not found.",
			});
		}

		return res.status(200).json({
			status: "success",
			message: "Search record deleted successfully.",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in deleting this search record. Please retry",
		});
	}
};

export default deleteSearchRecord;
