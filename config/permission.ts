export default [
	{
		module: "Case",
		route: ["/:caseId"],
		method: "PATCH",
		allowedRole: ["super-admin", "admin", "manager", "regular"],
	},
	{
		module: "Case",
		route: ["/:caseId"],
		method: "DELETE",
		allowedRole: ["super-admin"],
	},
	{
		module: "Staff",
		route: ["/"],
		method: "GET",
		allowedRole: ["super-admin", "admin", "manager"],
	},
	{
		module: "Staff",
		route: ["/:userId"],
		method: "GET",
		allowedRole: ["super-admin", "admin", "manager", "regular"],
	},
	{
		module: "Staff",
		route: ["/"],
		method: "POST",
		allowedRole: ["super-admin", "admin"],
	},
	{
		module: "Staff",
		route: ["/:userId"],
		method: "PUT",
		allowedRole: ["super-admin", "admin", "manager", "regular"],
	},
	{
		module: "Staff",
		route: ["/:userId"],
		method: "DELETE",
		allowedRole: ["super-admin"],
	},
] as const;
