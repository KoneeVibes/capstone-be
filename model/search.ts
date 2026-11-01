import { Schema } from "mongoose";
import appDB from "../db/dbConnect.ts";

const searchSchema = new Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		requester: {
			type: String,
			required: true,
		},
		query: {
			type: String,
			required: true,
			trim: true,
		},
		flag: {
			type: [String],
			enum: ["case", "staff", "registered-client", "guest-client"],
			default: [],
		},
		key: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
		},
	},
	{ timestamps: true },
);

searchSchema.index({ requester: 1, key: 1 }, { unique: true });

export default appDB.model("Search", searchSchema);
