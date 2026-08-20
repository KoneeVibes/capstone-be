import express from "express";
import type { Request } from "express";
import type { Field as MulterField } from "multer";
import fileUpload from "../middleware/fileUpload.ts";
import addCase from "../controller/case/addCase.ts";
import updateCase from "../controller/case/updateCase.ts";
import deleteCase from "../controller/case/deleteCase.ts";
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

router.get("/", retrieveAllCase);
router.get("/:caseId", retrieveCase);
router.delete("/:caseId", deleteCase);
router.post("/", fileUpload(options), addCase);
router.put("/:caseId", fileUpload(options), updateCase);

export default router;
