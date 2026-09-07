export type caseAcknowledgement = {
	customerName: string;
	trackingId: string;
};

export type paymentAcknowledgement = {
	customerName: string;
	amount: string;
	paymentReference: string;
};
