import express from "express";
import type { Request } from "express";
import type { Field as MulterField } from "multer";
import fileUpload from "../middleware/fileUpload.ts";
import isPermitted from "../middleware/permission.ts";
import isAuthorized from "../middleware/authorization.ts";
import initializeDispute from "../controller/dispute/initiateDispute.ts";
import retrieveAllDispute from "../controller/dispute/retrieveAllDispute.ts";
import retrieveDispute from "../controller/dispute/retrieveDispute.ts";
import rejectDispute from "../controller/dispute/rejectDispute.ts";

interface FileFilterCallback {
	(error: Error | null, acceptFile?: boolean): void;
}

interface FileUploadConfig {
	getFolderName: (req: Request, file: Express.Multer.File) => string;
	fieldName: string;
	isMultiple?: boolean;
	fields: MulterField[];
	fileFilter?: (
		req: Request,
		file: Express.Multer.File,
		cb: FileFilterCallback,
	) => void;
}

const options = {
	isMultiple: true,
	fields: [{ name: "attachment", maxCount: 5 }],
	getFolderName: (req, file) => "dispute attachment",
	fileFilter: (req, file, cb) => {
		const allowedTypes = new Set([
			"image/jpeg",
			"image/png",
			"application/pdf",
		]);
		if (allowedTypes.has(file.mimetype)) {
			cb(null, true);
		} else {
			cb(
				new Error(
					`Invalid media type "${file.mimetype}". Allowed: JPG, JPEG, PNG, PDF.`,
				),
				false,
			);
		}
	},
} as FileUploadConfig;

const router = express.Router();
const module = "Dispute";

// routes open to only authenticated user types
router.get("/:disputeId", isAuthorized, retrieveDispute);
router.get("/case/:caseId", isAuthorized, retrieveAllDispute);
router.post("/", isAuthorized, fileUpload(options), initializeDispute);

// routes open to only authenticated user types and permitted user roles
router.patch("/:disputeId", isAuthorized, isPermitted(module), rejectDispute);

export default router;
