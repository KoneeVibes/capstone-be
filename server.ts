import http from "http";
import { app } from "./app.ts";

const server = http.createServer(app);

server.on("listening", () =>
	console.log("The server is connected and listening for request"),
);
server.listen(9001);
