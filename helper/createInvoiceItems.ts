import SERVICE_SPLIT from "../config/service.ts";

function createInvoiceItems(totalPayable: number, state: string) {
	const items = SERVICE_SPLIT.map((service) => ({
		name: service.name,
		description: service.getDescription(state),
		quantity: 1,
		unitPrice: Math.floor((totalPayable * service.weight) / 100),
	}));
	const allocatedTotal = items.reduce((sum, item) => sum + item.unitPrice, 0);
	items[items.length - 1].unitPrice += totalPayable - allocatedTotal;
	return items;
}

export default createInvoiceItems;
