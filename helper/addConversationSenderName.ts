import User from "../model/user.ts";

type ConversationMessage = {
	id: string;
	senderId: string;
	text: string;
	sentAt: Date;
	updatedAt: Date;
};

type CaseWithConversation = {
	conversation?: {
		status: "open" | "closed";
		chat: ConversationMessage[];
	} | null;
};

async function addConversationSenderName<T extends CaseWithConversation>(
	cases: T[],
) {
	const senderIds = [
		...new Set(
			cases.flatMap((item) =>
				(item.conversation?.chat ?? []).map((message) => message.senderId),
			),
		),
	];

	const users = senderIds.length
		? await User.find({ id: { $in: senderIds } })
				.select("id firstName lastName")
				.lean()
				.exec()
		: [];

	const senderNames = new Map(
		users.map((user) => [
			user.id,
			[user.firstName, user.lastName].filter(Boolean).join(" ") ||
				"Unknown user",
		]),
	);

	return cases.map((item) => {
		const plainItem =
			typeof (item as { toObject?: unknown }).toObject === "function"
				? (item as unknown as { toObject: () => T }).toObject()
				: item;

		return {
			...plainItem,
			conversation: plainItem.conversation
				? {
						...plainItem.conversation,
						chat: (plainItem.conversation.chat ?? []).map((message) => ({
							...message,
							senderName: senderNames.get(message.senderId) ?? "Unknown user",
						})),
					}
				: plainItem.conversation,
		};
	});
}

export default addConversationSenderName;
