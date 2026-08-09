import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import type { Field as MulterField } from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import type { NextFunction, Request, Response } from "express";

dotenv.config();

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

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createUploader = ({
	getFolderName,
	fields,
	fieldName,
	isMultiple = false,
	fileFilter,
}: FileUploadConfig) => {
	const storage = new CloudinaryStorage({
		cloudinary,
		params: {
			folder: (req: Request, file: Express.Multer.File) => {
				return getFolderName(req, file);
			},
			allowed_formats: [
				"jpg",
				"jpeg",
				"png",
				"pdf",
				"doc",
				"docx",
				"xls",
				"xlsx",
				"txt",
				"csv",
				"ppt",
				"pptx",
			],
			transformation: { width: 500, height: 500, crop: "limit" },
		} as any,
	});

	const upload = multer({
		storage,
		limits: { fileSize: 5000000 }, // 5 MB limit
		fileFilter: (
			req: Request,
			file: Express.Multer.File,
			cb: FileFilterCallback,
		) => {
			if (fileFilter) {
				fileFilter(req, file, cb);
			} else {
				cb(null, true);
			}
		},
	});

	return isMultiple ? upload.fields(fields) : upload.single(fieldName);
};

const fileUpload =
	(options: FileUploadConfig) =>
	(req: Request, res: Response, next: NextFunction) => {
		const upload = createUploader(options);
		upload(req, res, (err) => {
			if (err) {
				console.error(err);
				return res.status(400).json({
					status: "fail",
					message: err.message || "File upload failed",
				});
			}
			next();
		});
	};

export default fileUpload;
