const isValidNumber = (value: unknown): boolean =>
	(typeof value === "number" && Number.isFinite(value)) ||
	(typeof value === "string" &&
		value.trim() !== "" &&
		!Number.isNaN(Number(value)));

export default isValidNumber;
