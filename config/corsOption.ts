import type { CorsOptions } from "cors";
import allowedOrigins from "./allowedOrigin.js";

const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
			return;
		}
		callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
	optionsSuccessStatus: 200,
};

export default corsOptions;
