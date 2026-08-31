import type { PaystackEventType } from "../../type/paystack.ts";
import chargeSuccess from "../handler/charge.success.ts";

const dispatch = [
	{
		type: "charge.success",
		handler: chargeSuccess,
	},
];

const dispatchEvent = async (
	eventType: PaystackEventType,
	eventData: unknown,
) => {
	const event = dispatch.find((item) => item.type === eventType);
	if (!event) {
		console.log(`No handler registered for event: ${eventType}`);
		return;
	}
	return event.handler(eventData);
};

export default dispatchEvent;
