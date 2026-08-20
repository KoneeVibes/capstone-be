import { Schema } from "mongoose";
import appDB from "../db/dbConnect.ts";

const invoiceItemSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
			default: 1,
		},
		unitPrice: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{ _id: false },
);

const invoiceSchema = new Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		caseId: {
			type: String,
			required: true,
			index: true,
		},
		items: {
			type: [invoiceItemSchema],
			required: true,
			validate: {
				validator: (items: unknown[]) => items.length > 0,
				message: "An invoice must contain at least one item.",
			},
		},
		totalPayable: {
			type: Number,
			required: true,
			min: 0,
		},
		currency: {
			type: String,
			required: true,
			default: "NGN",
			uppercase: true,
			trim: true,
		},
		status: {
			type: String,
			required: true,
			enum: ["unpaid", "paid", "refunded"],
			default: "unpaid",
		},
	},
	{ timestamps: true },
);

invoiceSchema.pre("validate", function () {
	this.totalPayable = (this.items ?? []).reduce(
		(sum, item) => sum + item.quantity * item.unitPrice,
		0,
	);
});

export default appDB.model("Invoice", invoiceSchema);
