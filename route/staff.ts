import express from "express";
import type { Request } from "express";
import type { Field as MulterField } from "multer";
import fileUpload from "../middleware/fileUpload.ts";
import addStaff from "../controller/staff/addStaff.ts";
import updateStaff from "../controller/staff/updateStaff.ts";
import deleteStaff from "../controller/staff/deleteStaff.ts";
import retrieveStaff from "../controller/staff/retrieveStaff.ts";
import retrieveAllStaff from "../controller/staff/retrieveAllStaff.ts";

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

router.get("/", retrieveAllStaff);
router.get("/:userId", retrieveStaff);
router.delete("/:userId", deleteStaff);
router.post("/", fileUpload(options), addStaff);
router.put("/:userId", fileUpload(options), updateStaff);

export default router;
