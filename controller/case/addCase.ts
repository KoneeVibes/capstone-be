import { v4 as uuidv4 } from "uuid";
import Case from "../../model/case.ts";
import Invoice from "../../model/invoice.ts";
import type { Request, Response } from "express";
import LOCATION_RATES from "../../config/location.ts";
import type { InquiryPurpose } from "../../type/purpose.ts";
import createInvoiceItems from "../../helper/createInvoiceItems.ts";
import validateRequiredFields from "../../validator/fieldValidator.ts";
import calculateTotalPayable from "../../helper/calculateTotalPayable.ts";

const addCase = async (req: Request, res: Response) => {
	const files = req.files;
	const fileGroups = Array.isArray(files) ? undefined : files;
	const surveyPlan =
		fileGroups?.["propertySurveyPlan"]?.map((attachment) => attachment.path) ||
		[];
	const titleDocument =
		fileGroups?.["propertyTitleDocument"]?.map(
			(attachment) => attachment.path,
		) || [];
	const {
		applicantName,
		applicantEmail,
		applicantPhone,
		propertyCity,
		propertyState,
		propertyLGA,
		propertyAddress,
		propertyType,
		inquiryPurpose,
		propertyTitleType,
		source,
	} = req.body;

	const validationResult = validateRequiredFields({
		applicantName,
		applicantEmail,
		applicantPhone,
		propertyCity,
		propertyState,
		propertyLGA,
		propertyAddress,
		propertyType,
		inquiryPurpose,
		propertyTitleType,
		surveyPlan,
		titleDocument,
		source,
	});
	if (!validationResult.valid) {
		return res.status(400).json({
			status: "fail",
			message: `Incomplete Inquiry Details: Missing ${validationResult.missingField}`,
		});
	}

	const propertyTitleTypeMap: Record<string, string> = {
		"Certificate of Occupancy": "certificate-of-occupancy",
		"Right of Occupancy": "right-of-occupancy",
		"Deed of Assignment": "deed-of-assignment",
		"Power of Attorney": "power-of-attorney",
		"Not sure / seller hasn't said": "not-sure/seller-has-not-said",
	};
	const inquiryPurposeMap: Record<string, string> = {
		"Due Diligence": "due-diligence",
		"Physical Inspection": "physical-inspection",
	};

	const normalizeEnumValues = (
		value: string | string[],
		valueMap: Record<string, string>,
		fieldName: string,
	): string[] => {
		const values = Array.isArray(value) ? value : [value];
		return values.map((item) => {
			const normalizedValue = valueMap[item];
			if (!normalizedValue) {
				throw new Error(`Invalid ${fieldName}: ${item}`);
			}
			return normalizedValue;
		});
	};

	try {
		const normalizedInquiryPurpose = normalizeEnumValues(
			inquiryPurpose,
			inquiryPurposeMap,
			"inquiry purpose",
		);
		const normalizedPropertyTitleTypes = normalizeEnumValues(
			propertyTitleType,
			propertyTitleTypeMap,
			"property title type",
		);

		const caseId = uuidv4();
		const newCase = new Case({
			id: caseId,
			applicantName,
			applicantEmail,
			applicantPhone,
			propertyCity,
			propertyState,
			propertyLGA,
			propertyAddress,
			propertyType: propertyType.toLowerCase(),
			inquiryPurpose: normalizedInquiryPurpose,
			propertyTitleType: normalizedPropertyTitleTypes,
			source,
			propertySurveyPlan: surveyPlan,
			propertyTitleDocument: titleDocument,
			status: "submitted",
		});
		const savedCase = await newCase.save();
		if (!savedCase) {
			return res.status(400).json({
				status: "fail",
				message: "Failed to save the new staff member. Please try again.",
			});
		}

		const location = LOCATION_RATES.find(
			(rate) =>
				rate.state === propertyState &&
				rate.lga === propertyLGA &&
				rate.city === propertyCity,
		);
		if (!location) {
			return res.status(404).json({
				status: "fail",
				message: "No price is configured for this location.",
			});
		}

		const totalPayable = calculateTotalPayable(
			location?.rate,
			normalizedInquiryPurpose as InquiryPurpose[],
		);
		const items = createInvoiceItems(totalPayable, propertyState);

		const caseInvoice = await Invoice.create({
			id: uuidv4(),
			caseId,
			items,
		});
		if (!caseInvoice) {
			return res.status(400).json({
				status: "fail",
				message:
					"Failed to generate corresponding case invoice. Please try again.",
			});
		}

		return res.status(201).json({
			status: "success",
			message: "Case successfully added",
			data: { invoiceId: caseInvoice.id },
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "fail",
			message:
				"Server encountered an issue in adding this case. Please contact the administrator for assistance.",
		});
	}
};

export default addCase;
