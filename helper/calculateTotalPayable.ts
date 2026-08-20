import type { InquiryPurpose } from "../type/purpose.ts";
import PURPOSE_MULTIPLIERS from "../config/purposeMultiplier.ts";

function calculateTotalPayable(
	baseLocationPrice: number,
	purposes: InquiryPurpose[],
) {
	return purposes.reduce(
		(total, purpose) =>
			total + Math.round(baseLocationPrice * PURPOSE_MULTIPLIERS[purpose]),
		0,
	);
}

export default calculateTotalPayable;
