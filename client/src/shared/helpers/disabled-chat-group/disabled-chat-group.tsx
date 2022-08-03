class DisabledChatUsers {
	hasNext = false;

	next(callback: any) {
		callback([], null);
	}
}

export const DisabledChatUsersFactory = () => new DisabledChatUsers();
