const isValidString = (value: unknown): boolean =>
	typeof value === "string" && value.trim().length > 0;

export default isValidString;
