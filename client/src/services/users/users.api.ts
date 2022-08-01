import { config } from '../../config';
import { APIHandler } from '../api-handler';
import { User } from '../auth';
import { GenericMessage } from './types/generic_message';
import { UserUpdateRequest } from './types/update.request';

const PREFIX = 'users';

export class UsersAPI {
	static async getCurrentUser(url?: string): Promise<User | null> {
		if (!localStorage.getItem(config.accessTokenLocation) || !url) {
			return null;
		}

		try {
			const resp = await APIHandler.get<User>(PREFIX + '/self');

			return resp?.data ?? null;
		} catch (err) {
			return null;
		}
	}

	static async updateCurrentUser(data: UserUpdateRequest): Promise<User | null> {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				for (const entry of value) {
					formData.append(key, entry);
				}
			} else {
				formData.set(key, value);
			}
		});

		const resp = await APIHandler.put<User>(PREFIX + '/self', formData);

		return resp?.data ?? null;
	}

	static async subscribeToPremium(orderId: string): Promise<GenericMessage | null> {
		const formData = new FormData();
		formData.set('order_id', orderId);

		const resp = await APIHandler.post<GenericMessage>(PREFIX + '/subscribe', formData);

		return resp?.data ?? null;
	}
}
