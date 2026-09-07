import type { caseAcknowledgement } from "../../type/view.ts";

export const caseAcknowledgementTemplate = ({
	customerName,
	trackingId,
}: caseAcknowledgement) => {
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
			<title>Case Acknowledgement</title>
		</head>

		<body>
			<div class="header-container">
				<img src="https://res.cloudinary.com/wyv2jitx/image/upload/v1788732803/header.svg" alt="header-img" />
			</div>

			<div class="content-area">
				<div class="subject">
					<h1>Property Search</h1>
				</div>

				<div class="body">
					<p>Hi ${customerName},</p>

					<p>
						Thank you for submitting your property inquiry through PropertyIntel.
						We are pleased to confirm that your case has been successfully
						submitted and received.
					</p>

					<div>
						<p>
							<strong>Tracking ID:</strong><br />
							<span class="highlight-text">${trackingId}</span>
						</p>
					</div>

					<p>
						Your case is now in our system and will proceed through the
						appropriate review process. We will keep you informed of any progress
						or requirements as your case moves forward.
					</p>

					<p>
						Please keep your tracking ID for future correspondence regarding
						this inquiry.
					</p>

					<p>
						You may also track the progress of your case through our website and
						mobile app using the tracking ID associated with this submission.
					</p>

					<p>
						If you need to contact us regarding your case, please include your
						tracking ID in your correspondence.
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
