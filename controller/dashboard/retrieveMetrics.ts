import type { Request, Response } from "express";
import Case from "../../model/case.ts";

type AuthenticatedUser = {
	id: string;
	role: string;
	type: string;
	email: string;
};

const clientInProgressStatuses = [
	"payment-validated",
	"assigned",
	"accepted",
	"under-review",
	"pending-information",
	"disputed",
] as const;

const retrieveMetrics = async (req: Request, res: Response) => {
	const currentUser = (req as Request & { user?: AuthenticatedUser }).user;
	if (!currentUser) {
		return res.status(401).json({
			status: "fail",
			message: "Authentication is required.",
		});
	}

	try {
		if (currentUser.type === "staff") {
			if (!currentUser.id || !currentUser.role) {
				return res.status(400).json({
					status: "fail",
					message: "Authenticated staff details are incomplete.",
				});
			}

			const now = new Date();
			const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

			const queueFilter = {
				$or: [
					{ assigneeId: currentUser.id },
					...(currentUser.role === "super-admin"
						? [{ status: "under-review" as const }]
						: []),
				],
			};
			const recentFilter = {
				statusHistory: {
					$elemMatch: {
						assigneeId: currentUser.id,
						changedAt: {
							$gte: oneWeekAgo,
							$lte: now,
						},
					},
				},
			};

			const [queue, recent] = await Promise.all([
				Case.countDocuments(queueFilter).exec(),
				Case.countDocuments(recentFilter).exec(),
			]);

			return res.status(200).json({
				status: "success",
				message: "System metrics retrieved successfully.",
				data: {
					queue,
					recent,
				},
				meta: {
					recentSince: oneWeekAgo,
					asOf: now,
				},
			});
		}

		if (
			currentUser.type === "registered-client" ||
			currentUser.type === "guest-client"
		) {
			if (!currentUser.email) {
				return res.status(400).json({
					status: "fail",
					message: "Authenticated client email was not found.",
				});
			}

			const clientCaseFilter = {
				applicantEmail: currentUser.email,
			};
			const [totalSearches, reportsReady, inProgress, needsYourInput] =
				await Promise.all([
					Case.countDocuments(clientCaseFilter).exec(),
					Case.countDocuments({
						...clientCaseFilter,
						status: "closed",
					}).exec(),
					Case.countDocuments({
						...clientCaseFilter,
						status: { $in: clientInProgressStatuses },
					}).exec(),
					Case.countDocuments({
						...clientCaseFilter,
						status: "pending-information",
					}).exec(),
				]);

			return res.status(200).json({
				status: "success",
				message: "System metrics retrieved successfully.",
				data: {
					totalSearches,
					reportsReady,
					inProgress,
					needsYourInput,
				},
			});
		}

		return res.status(403).json({
			status: "fail",
			message: "You are not authorized to retrieve these metrics.",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message: "Server encountered an issue retrieving metrics. Please retry.",
		});
	}
};

export default retrieveMetrics;
