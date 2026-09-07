export type emailConfig = {
	email: string;
    text?: string;
    html?: string;
	attachments?: {
		filename: string;
		content: Uint8Array<ArrayBufferLike>;
		contentType: string;
	}[];
	subject: string;
};
