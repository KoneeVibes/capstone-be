import { Schema } from "mongoose";
import appDB from "../db/dbConnect.ts";

const OTPSchema = new Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		requester: {
			type: String,
			required: true,
			unique: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["sign-up", "password-reset"],
		},
		password: {
			type: String,
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
			expires: 0,
		},
	},
	{ timestamps: true },
);

export default appDB.model("OTP", OTPSchema);
