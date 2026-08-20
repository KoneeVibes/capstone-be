interface ValidationError {
	valid: false;
	missingField: string;
}

interface ValidationSuccess {
	valid: true;
}

type ValidationResult = ValidationError | ValidationSuccess;

const validateRequiredFields = (
	fields: Record<string, unknown>,
): ValidationResult => {
	for (const [key, value] of Object.entries(fields)) {
		if (
			value === null ||
			value === undefined ||
			(typeof value === "string" && !value.trim()) ||
			(Array.isArray(value) && value.length === 0)
		) {
			return { valid: false, missingField: key };
		}
	}
	return { valid: true };
};

export default validateRequiredFields;
