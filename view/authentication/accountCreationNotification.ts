import type { accountCreationNotification } from "../../type/view.ts";

export const accountCreationNotificationTemplate = ({
	customerEmail,
	customerName,
	otp,
	autoCreation,
}: accountCreationNotification) => {
	const activationLink = `https://capstoneglobalhq.com/${customerEmail}/guest-client`;
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
            <title>Activate Your PropertyIntel Account — OTP</title>
        </head>

        <body>
            <div class="header-container">
                <img src="https://res.cloudinary.com/wyv2jitx/image/upload/v1788732803/header.svg" alt="header-img" />
            </div>

            <div class="content-area">
                <div class="subject">
                    <h1>Account Created Successfully</h1>
                </div>

                <div class="body">
                    <p>Hi ${customerName},</p>

                    <p>Your PropertyIntel account has been created successfully.</p>

                    <p>
                        To activate your account, please use the One-Time Password (OTP)
                        below:
                    </p>

                    <div>
                        <p>
                            <strong>One Time Password (OTP):</strong><br />
                            <span class="highlight-text">${otp}</span>
                        </p>
                    </div>

                    <p>
                        This OTP is required to verify your email address and activate your
                        account. For your security, please do not share this code with anyone.
                    </p>

                    ${
											autoCreation
												? `
                        <div>
                            <p>
                                To complete your account activation, download the PropertyIntel app from the Google Play Store and use the link below to proceed with activation:
                            </p>
                            <p>
                                <a href="${activationLink}" target="_blank">Activate Your Account</a>
                            </p>
                        </div>
                        `
												: ""
										}

                    <p>
                        If you did not create this account, please disregard this email or
                        contact our support team.
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
