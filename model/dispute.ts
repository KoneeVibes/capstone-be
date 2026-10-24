import { Schema } from "mongoose";
import appDB from "../db/dbConnect.ts";

// the reason dispute is a standalone collection rather than being a field in the case collection is that right from it's insertion
// it wouldn't update the case (since a case or case status isn't updated by a dispute till it is accepted), so we will not correctly track it's
// insertion by case status. So it works as a standalone collection, and we can track from insertion by status and then when it is accepted, it
// updates a case or case status as a side effect.
const disputeSchema = new Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		caseId: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		attachment: {
			type: [String],
			default: null,
		},
		status: {
			type: String,
			required: true,
			default: "open",
			enum: ["open", "accepted", "rejected"],
		},
		rejectionNote: {
			type: String,
			default: null,
			trim: true,
		},
	},
	{ timestamps: true },
);

disputeSchema.index(
	{ caseId: 1 },
	{ unique: true, partialFilterExpression: { status: "open" } },
);

export default appDB.model("Dispute", disputeSchema);
