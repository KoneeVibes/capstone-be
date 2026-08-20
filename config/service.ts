export default [
	{
		code: "registry-search",
		name: "Registry Search",
		weight: 45,
		getDescription: (state: string) => `${state} Land Registry`,
	},
	{
		code: "title-verification",
		name: "Title Verification",
		weight: 35,
		getDescription: () => "Certificate of Occupancy (C of O)",
	},
	{
		code: "survey-chart-verification",
		name: "Survey Chart Verification",
		weight: 20,
		getDescription: () => "Surveyor General's Office",
	},
] as const;
