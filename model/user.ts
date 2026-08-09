import bcrypt from "bcrypt";
import { Schema } from "mongoose";
import appDB from "../db/dbConnect.ts";

const userSchema = new Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		middleName: {
			type: String,
			default: null,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		avatar: {
			type: String,
			default: null,
		},
		phone: {
			type: String,
			default: null,
		},
		password: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["staff", "registered-client", "guest-client"],
		},
		role: {
			type: String,
			default: null,
		},
		organization: {
			type: String,
			default: null,
		},
		status: {
			type: String,
			required: true,
			default: "active",
			enum: ["active", "inactive"],
		},
		passwordChanged: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

userSchema.pre("save", async function () {
	if (this.isModified("password")) {
		const saltRounds = 10;
		this.password = await bcrypt.hash(this.password, saltRounds);
	}
});

export default appDB.model("User", userSchema);
