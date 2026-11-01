type EmailAttachment =
	| {
			path: string;
			filename: string;
	  }
	| {
			content: Buffer | Uint8Array | string;
			filename: string;
	  };

export type emailConfig = {
	email: string;
	subject: string;
	text?: string;
	html?: string;
	attachments?: EmailAttachment[];
};
