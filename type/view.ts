export type caseAcknowledgement = {
	customerName: string;
	trackingId: string;
};

export type paymentAcknowledgement = {
	customerName: string;
	amount: string;
	paymentReference: string;
};

export type accountCreationNotification = {
	customerEmail: string;
	customerName: string;
	otp: string;
	autoCreation: boolean;
};

export type passwordResetNotification = {
	customerName: string;
	otp: string;
};
