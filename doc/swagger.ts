import path from "path";
import { fileURLToPath } from "node:url";
import swaggerJSDoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileExtension = import.meta.url.endsWith(".ts") ? "ts" : "js";
const docsDirectory = path.join(__dirname, "route").replace(/\\/g, "/");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "PropertyIntel API Documentation",
			version: "1.0.0",
			description: "API documentation for the PropertyIntel application",
		},
		servers: [
			{ url: "http://localhost:9001" },
			{ url: "https://capstone-be-1hri.onrender.com" },
		],
		// components: {
		// 	securitySchemes: {
		// 		BearerAuth: {
		// 			type: "http",
		// 			scheme: "bearer",
		// 			bearerFormat: "JWT",
		// 		},
		// 	},
		// },
		// security: [{ BearerAuth: [] }],
	},
	apis: [`${docsDirectory}/**/*.${fileExtension}`],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
