import express from "express";
import type { Request } from "express";
import type { Field as MulterField } from "multer";
import fileUpload from "../middleware/fileUpload.ts";
import isAuthorized from "../middleware/authorization.ts";
import updateUserProfile from "../controller/profile/updateUserProfile.ts";
import retrieveUserProfile from "../controller/profile/retrieveUserProfile.ts";

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
	getFolderName: (req, file) => "avatar",
	fieldName: "avatar",
	fileFilter: (req, file, cb) => {
		const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Only JPG, JPEG and PNG files are allowed!"), false);
		}
	},
} as FileUploadConfig;

const router = express.Router();

// routes open to only authenticated user types
router.get("/", isAuthorized, retrieveUserProfile);
router.put("/", isAuthorized, fileUpload(options), updateUserProfile);

export default router;
