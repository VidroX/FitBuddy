import { APIHandler } from '../api-handler';
import { UserResponse } from './types/auth.response';

const PREFIX = 'auth';

export class AuthAPI {
	private static getProperUserResponse(response: UserResponse): UserResponse {
		return {
			user: {
				...response.user,
				last_login: new Date(response.user['last_login']),
				subscription_end_date: response.user['subscription_end_date'] ? new Date(response.user['subscription_end_date']) : null,
				account_creation_date: new Date(response.user['account_creation_date']),
			},
			tokens: response.tokens,
		};
	}

	static async login(data: FormData): Promise<UserResponse | undefined> {
		const resp = await APIHandler.post<UserResponse>(PREFIX + '/login', data);

		if (!resp?.data) {
			return;
		}

		return this.getProperUserResponse(resp.data);
	}

	static async register(data: FormData): Promise<UserResponse | undefined> {
		const resp = await APIHandler.post<UserResponse>(PREFIX + '/register', data);

		if (!resp?.data) {
			return;
		}

		return this.getProperUserResponse(resp.data);
	}
}
