import { config } from '../../config';
import { APIHandler } from '../api-handler';
import { User } from '../auth';
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
		if (!localStorage.getItem(config.accessTokenLocation)) {
			return null;
		}

		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => formData.set(key, value));
		const resp = await APIHandler.put<User>(PREFIX + '/self', formData);
		return resp?.data ?? null;
	}
}
