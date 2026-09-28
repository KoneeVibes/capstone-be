import type { passwordResetNotification } from "../../type/view.ts";

export const forgotPasswordSupportTemplate = ({
	customerName,
	otp,
}: passwordResetNotification) => {
	return `<html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
                @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

                body {
                    margin: 0;
                    border-radius: 8px;
                    background-color: white;
                }

                .header-container {
                    display: flex;
                }

                .header-container > img {
                    width: 100%;
                }

                h1 {
                    font-family: Inter;
                    font-weight: 700;
                    font-size: 20px;
                    line-height: normal;
                    color: #121a26;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                p {
                    font-family: Inter;
                    font-weight: 400;
                    font-size: 16px;
                    line-height: normal;
                    color: #384860;
                    overflow: hidden;
                    white-space: normal;
                    text-overflow: ellipsis;
                }

                .content-area {
                    padding: 2rem;
                }

                .highlight-text {
                    font-weight: 700;
                    font-size: 32px;
                }
            </style>
            <title>Password Reset Request — OTP</title>
        </head>

        <body>
            <div class="header-container">
                <img src="https://res.cloudinary.com/wyv2jitx/image/upload/v1788732803/header.svg" alt="header-img" />
            </div>

            <div class="content-area">
                <div class="subject">
                    <h1>Password Reset Request</h1>
                </div>

                <div class="body">
                    <p>Hi ${customerName},</p>

                    <p>We received a request to reset the password for your PropertyIntel account.</p>

                    <p>
                        To continue with the password reset, please use the One-Time Password (OTP) below:
                    </p>

                    <div>
                        <p>
                            <strong>One Time Password (OTP):</strong><br />
                            <span class="highlight-text">${otp}</span>
                        </p>
                    </div>

                    <p>
                        This OTP is required to verify your password reset request. For your security, please do not share this code with anyone.
                    </p>

                    <p>
                        If you did not request a password reset, please disregard this email. Your account password will not be changed unless the reset process is completed.
                    </p>

                    <p>Thank you for choosing PropertyIntel.</p>

                    <p>
                        Kind regards,<br />
                        <strong>PropertyIntel Team</strong>
                    </p>
                </div>
            </div>
        </body>
    </html>`;
};
