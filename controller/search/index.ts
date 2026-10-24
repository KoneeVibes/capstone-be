import type { Request, Response } from "express";
import type { QueryFilter } from "mongoose";
import Case from "../../model/case.ts";
import User from "../../model/user.ts";

const searchFlags = [
	"case",
	"staff",
	"registered-client",
	"guest-client",
] as const;

type SearchFlag = (typeof searchFlags)[number];

type AuthenticatedUser = {
	id: string;
	role: string;
	type: string;
	email: string;
};

type CaseSearchDocument = {
	[key: string]: unknown;
};

type UserSearchDocument = {
	[key: string]: unknown;
};

const escapeRegex = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const searchController = async (req: Request, res: Response) => {
	const currentUser = (req as Request & { user?: AuthenticatedUser }).user;

	if (!currentUser) {
		return res.status(401).json({
			status: "fail",
			message: "Authentication is required.",
		});
	}

	const isStaff = currentUser.type === "staff";
	const isRegisteredClient = currentUser.type === "registered-client";
	const allowedStaffRoles = ["super-admin", "admin", "manager", "regular"];

	if (!isStaff || !allowedStaffRoles.includes(currentUser.role)) {
		if (!isRegisteredClient) {
			return res.status(403).json({
				status: "fail",
				message: "You are not authorized to use search.",
			});
		}
	}

	const rawQuery = req.query.q;
	if (typeof rawQuery !== "string" || rawQuery.trim().length < 2) {
		return res.status(400).json({
			status: "fail",
			message: "Provide a search term containing at least 2 characters.",
		});
	}

	const searchTerm = rawQuery.trim();
	if (searchTerm.length > 100) {
		return res.status(400).json({
			status: "fail",
			message: "The search term cannot exceed 100 characters.",
		});
	}

	const pageNumber = Math.max(Number(req.query.page) || 1, 1);
	const limit = Math.min(Math.max(Number(req.query.perPage) || 10, 1), 100);
	const skip = (pageNumber - 1) * limit;
	const regex = new RegExp(escapeRegex(searchTerm), "i");

	const rawFlag = req.query.flag;
	let requestedFlags: string[];

	if (rawFlag === undefined) {
		requestedFlags = isRegisteredClient ? ["case"] : [...searchFlags];
	} else if (typeof rawFlag === "string") {
		requestedFlags = [rawFlag];
	} else if (
		Array.isArray(rawFlag) &&
		rawFlag.every((value): value is string => typeof value === "string")
	) {
		requestedFlags = rawFlag;
	} else {
		return res.status(400).json({
			status: "fail",
			message: "Invalid search flag.",
		});
	}

	const invalidFlags = requestedFlags.filter(
		(flag) => !searchFlags.includes(flag as SearchFlag),
	);
	if (invalidFlags.length > 0) {
		return res.status(400).json({
			status: "fail",
			message: `Invalid search flag: ${invalidFlags.join(", ")}.`,
		});
	}

	const flags = [...new Set(requestedFlags)] as SearchFlag[];

	if (isRegisteredClient && flags.some((flag) => flag !== "case")) {
		return res.status(403).json({
			status: "fail",
			message: "Registered clients may search cases only.",
		});
	}

	try {
		const results: {
			cases?: CaseSearchDocument[];
			staff?: UserSearchDocument[];
			registeredClients?: UserSearchDocument[];
			guestClients?: UserSearchDocument[];
		} = {};

		const caseSearchFields = [
			{ trackingId: regex },
			{ applicantName: regex },
			{ applicantEmail: regex },
			{ applicantPhone: regex },
			{ propertyCity: regex },
			{ propertyState: regex },
			{ propertyLGA: regex },
			{ propertyAddress: regex },
		];

		if (flags.includes("case")) {
			const caseVisibility: QueryFilter<CaseSearchDocument> = isRegisteredClient
				? { applicantEmail: currentUser.email }
				: currentUser.role === "super-admin"
					? {}
					: {
							$or: [
								{
									status: {
										$in: ["submitted", "payment-validated"],
									},
								},
								{
									"statusHistory.assigneeId": currentUser.id,
								},
							],
						};

			const caseQuery: QueryFilter<CaseSearchDocument> = {
				$and: [caseVisibility, { $or: caseSearchFields }],
			};

			results.cases = (await Case.find(caseQuery)
				.skip(skip)
				.limit(limit)
				.lean()
				.exec()) as CaseSearchDocument[];
		}

		const userSearchFields = [
			{ firstName: regex },
			{ middleName: regex },
			{ lastName: regex },
			{ email: regex },
			{ phone: regex },
			{ organization: regex },
		];

		const findUsers = async (type: SearchFlag) => {
			const userQuery: QueryFilter<UserSearchDocument> = {
				type,
				$or: userSearchFields,
			};

			return (await User.find(userQuery)
				.select("-password")
				.skip(skip)
				.limit(limit)
				.lean()
				.exec()) as UserSearchDocument[];
		};

		if (flags.includes("staff")) {
			results.staff = await findUsers("staff");
		}
		if (flags.includes("registered-client")) {
			results.registeredClients = await findUsers("registered-client");
		}
		if (flags.includes("guest-client")) {
			results.guestClients = await findUsers("guest-client");
		}

		const hasResults = Object.values(results).some(
			(items) => Array.isArray(items) && items.length > 0,
		);

		if (!hasResults) {
			return res.status(404).json({
				status: "success",
				message: "No matching records found.",
				data: results,
				meta: {
					page: pageNumber,
					perPage: limit,
				},
			});
		}

		return res.status(200).json({
			status: "success",
			message: "Search completed successfully.",
			data: results,
			meta: {
				page: pageNumber,
				perPage: limit,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message: "The server encountered an issue while searching. Please retry.",
		});
	}
};

export default searchController;
