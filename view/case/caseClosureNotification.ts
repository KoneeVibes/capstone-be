import type { caseClosureNotification } from "../../type/view.ts";

export const caseClosureNotificationTemplate = ({
	customerName,
	trackingId,
	status,
}: caseClosureNotification) => {
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
            <title>Case Closure</title>
        </head>

        <body>
            <div class="header-container">
                <img src="https://res.cloudinary.com/wyv2jitx/image/upload/v1788732803/header.svg" alt="header-img" />
            </div>

            <div class="content-area">
                <div class="subject">
                    <h1>Inquiry Completed!</h1>
                </div>

                <div class="body">
                    <p>Hi ${customerName},</p>

                    <p>
                        We are pleased to inform you that your property inquiry has been successfully completed and your case has now been closed.
                    </p>

                    <p>
                        Please find attached the inquiry report detailing the findings and outcomes of the requested service for your review and reference.
                    </p>

                    <div>
                        <p>
                            <strong>Tracking ID:</strong><br />
                            <span class="highlight-text">${trackingId}</span>
                        </p>
                        <p>
                            <strong>Case Status:</strong><br />
                            <span class="highlight-text">${status}</span>
                        </p>
                    </div>

                    <p>
                        We appreciate the opportunity to have served you and thank you for choosing PropertyIntel for your property intelligence and due diligence needs.
                    </p>

                    <p>
                        Should you require any clarification or further assistance regarding the report, please do not hesitate to contact our team. Kindly reference your Tracking ID in any subsequent correspondence.
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
