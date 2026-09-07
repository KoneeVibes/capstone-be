import nodemailer from "nodemailer";
import type { emailConfig } from "../../../type/util.ts";

const sendEmail = async ({
	email,
    text,
    html,
	attachments,
	subject,
}: emailConfig) => {
	const transporter = nodemailer.createTransport({
		host: process.env.MAIL_SERVER,
		port: 465,
		secure: true,
		auth: {
			user: process.env.MAIL_ID,
			pass: process.env.MAIL_PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	const mailOptions = {
		from: `"PropertyIntel" <${process.env.MAIL_ID}>`,
		to: email,
		subject: subject,
        text: text,
        html: html,
		attachments: attachments?.map((att) => ({
			...att,
			content: Buffer.from(att.content),
		})),
	};

	return transporter.sendMail(mailOptions);
};

export default sendEmail;
