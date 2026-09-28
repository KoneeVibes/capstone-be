import type { NextFunction, Request, Response } from "express";
import systemPermission from "../config/permission.ts";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const validMethods = new Set<HttpMethod>([
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"DELETE",
]);

export default function isPermitted(module: string) {
	return (req: Request, res: Response, next: NextFunction): void => {
		try {
			const user = (
				req as Request & {
					user?: { id: string; role: string };
				}
			).user;
			if (!user) {
				res.status(401).json({
					status: "fail",
					message: "Authentication is required to access this resource.",
				});
				return;
			}

			const method = req.method.toUpperCase();
			if (!validMethods.has(method as HttpMethod)) {
				res.status(405).json({
					status: "fail",
					message: `Unsupported HTTP method: ${req.method}`,
				});
				return;
			}

			const route = req.route?.path;
			if (typeof route !== "string") {
				res.status(500).json({
					status: "fail",
					message: "Unable to identify the registered route for this resource.",
				});
				return;
			}

			const foundPermission = systemPermission.find(
				(permission) =>
					permission.module === module &&
					permission.method === method &&
					(permission.route as readonly string[]).includes(route),
			);
			if (!foundPermission) {
				res.status(403).json({
					status: "fail",
					message: `No permission is configured for ${module} ${method} ${route}.`,
				});
				return;
			}
			if (!foundPermission.allowedRole.includes(user.role as never)) {
				res.status(403).json({
					status: "fail",
					message: "You are not permitted to perform this action.",
				});
				return;
			}

			next();
		} catch (error) {
			console.error("Access control error:", error);
			res.status(500).json({
				status: "fail",
				message:
					"Server error during permission and access control cross-referencing.",
			});
		}
	};
}
