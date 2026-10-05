import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

function dBConnect() {
	const connectionString =
		"mongodb://koneevibes_db_user:bNeHBVjZGEp01uBw@ac-sxps8xs-shard-00-00.nv0zc1c.mongodb.net:27017,ac-sxps8xs-shard-00-01.nv0zc1c.mongodb.net:27017,ac-sxps8xs-shard-00-02.nv0zc1c.mongodb.net:27017/propertyintel?ssl=true&replicaSet=atlas-red49s-shard-0&authSource=admin&appName=development";
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
