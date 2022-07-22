import { config } from '../../config';
import { APIHandler } from '../api-handler';
import { User } from '../auth';

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
}
