import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

function dBConnect() {
	const connectionString = process.env.CONNECTION_STRING;
	if (!connectionString) {
		throw new Error("CONNECTION_STRING is not defined");
	}

	const dBConnection = mongoose.createConnection(connectionString);

	dBConnection.on("connected", () => {
		console.log("Successfully connected to database");
	});

	dBConnection.on("error", (err: Error) => {
		console.log("Unable to connect to database");
		console.error(err);
	});

	return dBConnection;
}

export default dBConnect();
