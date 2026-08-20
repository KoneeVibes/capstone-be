import { Schema } from "mongoose";
import appDB from "../db/dbConnect.ts";

const caseSchema = new Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		source: {
			type: String,
			required: true,
			enum: ["website", "mobile-app", "third-party-api"],
		},
		applicantName: {
			type: String,
			required: true,
		},
		applicantEmail: {
			type: String,
			required: true,
		},
		applicantPhone: {
			type: String,
			required: true,
		},
		propertyCity: {
			type: String,
			required: true,
		},
		propertyState: {
			type: String,
			required: true,
		},
		propertyLGA: {
			type: String,
			required: true,
		},
		propertyAddress: {
			type: String,
			required: true,
		},
		propertyType: {
			type: String,
			required: true,
			enum: ["land", "building", "commercial"],
		},
		inquiryPurpose: {
			type: [
				{
					type: String,
					enum: ["due-diligence", "physical-inspection"],
				},
			],
			required: true,
		},
		propertyTitleType: {
			type: [
				{
					type: String,
					enum: [
						"certificate-of-occupancy",
						"right-of-occupancy",
						"deed-of-assignment",
						"power-of-attorney",
						"not-sure/seller-has-not-said",
					],
				},
			],
			required: true,
		},
		propertySurveyPlan: {
			type: [String],
			default: null,
		},
		propertyTitleDocument: {
			type: [String],
			default: null,
		},
		status: {
			type: String,
			required: true,
			default: "active",
			enum: [
				"submitted",
				"assigned",
				"accepted",
				"pending-information",
				"under-review",
				"closed",
				"suspended",
			],
		},
	},
	{ timestamps: true },
);

export default appDB.model("Case", caseSchema);
