import express from "express";
import type { Request } from "express";
import type { Field as MulterField } from "multer";
import fileUpload from "../middleware/fileUpload.ts";
import isPermitted from "../middleware/permission.ts";
import isAuthorized from "../middleware/authorization.ts";
import addCase from "../controller/case/addCase.ts";
import updateCase from "../controller/case/updateCase.ts";
import deleteCase from "../controller/case/deleteCase.ts";
import trackCase from "../controller/case/trackCase.ts";
import retrieveCase from "../controller/case/retrieveCase.ts";
import retrieveAllCase from "../controller/case/retrieveAllCase.ts";

interface FileFilterCallback {
	(error: Error | null, acceptFile?: boolean): void;
}

interface FileUploadConfig {
	getFolderName: (req: Request, file: Express.Multer.File) => string;
	fields: MulterField[];
	fieldName: string;
	isMultiple?: boolean;
	fileFilter?: (
		req: Request,
		file: Express.Multer.File,
		cb: FileFilterCallback,
	) => void;
}

const options = {
	isMultiple: true,
	getFolderName: (req, file) => {
		const folderMap: Record<string, string> = {
			propertySurveyPlan: "survey plan",
			propertyTitleDocument: "title document",
		};
		return folderMap[file.fieldname] ?? "misc";
	},
	fields: [{ name: "propertySurveyPlan" }, { name: "propertyTitleDocument" }],
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
const module = "Case";

// routes open to general public
router.get("/track/:trackingId", trackCase);
router.post("/", fileUpload(options), addCase);

// routes open to only authenticated user types
router.get("/", isAuthorized, retrieveAllCase);
router.get("/:caseId", isAuthorized, retrieveCase);

// routes open to only authenticated user types and permitted user roles
router.patch(
	"/:caseId",
	isAuthorized,
	isPermitted(module),
	fileUpload(options),
	updateCase,
);
router.delete("/:caseId", isAuthorized, isPermitted(module), deleteCase);

export default router;
