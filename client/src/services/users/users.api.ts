import { config } from '../../config';
import { APIHandler } from '../api-handler';
import { User } from '../auth';
import { GenericMessage } from './types/generic_message';
import { UserUpdateRequest } from './types/update.request';

const PREFIX = 'users';

export class UsersAPI {
	private static getProperUserResponse(response: User): User {
		return {
			...response,
			last_login: new Date(response['last_login']),
			subscription_end_date: response['subscription_end_date'] ? new Date(response['subscription_end_date']) : null,
			account_creation_date: new Date(response['account_creation_date']),
			activities_change_date: response['activities_change_date'] ? new Date(response['activities_change_date']) : null,
		};
	}

	static async getCurrentUser(url?: string): Promise<User | null> {
		if (!localStorage.getItem(config.accessTokenLocation) || !url) {
			return null;
		}

		try {
			const resp = await APIHandler.get<User>(PREFIX + '/self');

			if (!resp?.data) {
				return null;
			}

			return this.getProperUserResponse(resp.data);
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
