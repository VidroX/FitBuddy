import axios, { AxiosError, AxiosResponse } from 'axios';
import { config } from '../config';
import { store } from '../redux';
import { setUser } from '../redux/features/user/userSlice';

export interface APIFieldError {
	field_id: string;
	reason: string;
}

export interface APIPayload {
	message: string;
	errors?: APIFieldError[];
}

export interface APIErrorData {
	statusCode: number;
	payload: APIPayload;
}

interface GenericAPIPayload {
	detail: APIPayload;
}

export class APIError extends Error {
	name: string;
	message: string;
	data?: APIErrorData;

	constructor(name: string, message: string, data?: APIErrorData) {
		super(message);

		this.name = name;
		this.message = message;

		if (data) {
			this.data = data;
		}
	}
}

export class APIHandler {
	public static API_PREFIX = config.apiEndpoint + '/api/v1/';

	private static getConfig() {
		return {
			headers: {
				Authorization: localStorage.getItem(config.accessTokenLocation) || '',
			},
		};
	}

	private static async handleError(err: any | AxiosError) {
		if (!axios.isAxiosError(err) || !err?.response?.status) {
			throw new APIError('API Generic Error', err.message);
		}

		switch (err.response.status) {
			case 401: // TODO: Handle Token Refresh Logic
				localStorage.removeItem(config.accessTokenLocation);
				store.dispatch(setUser(undefined));
				break;
			default:
				throw new APIError('API Server Error', err.message, {
					statusCode: err.response.status,
					payload: {
						message: (err.response.data as GenericAPIPayload)?.detail?.message ?? '',
						errors: (err.response.data as GenericAPIPayload)?.detail?.errors ?? [],
					},
				});
		}
	}

	static async get<T = any, R = AxiosResponse<T>>(endpoint: string): Promise<R | undefined> {
		try {
			return await axios.get<T, R>(this.API_PREFIX + endpoint, this.getConfig());
		} catch (err: any | AxiosError) {
			await this.handleError(err);
			return;
		}
	}

	static async post<T = any, R = AxiosResponse<T>>(endpoint: string, data: FormData): Promise<R | undefined> {
		try {
			return await axios.post<T, R>(this.API_PREFIX + endpoint, data, this.getConfig());
		} catch (err: any | AxiosError) {
			await this.handleError(err);
			return;
		}
	}

	static async put<T = any, R = AxiosResponse<T>>(endpoint: string, data: FormData): Promise<R | undefined> {
		try {
			return await axios.put<T, R>(this.API_PREFIX + endpoint, data, this.getConfig());
		} catch (err: any | AxiosError) {
			await this.handleError(err);
			return;
		}
	}

	static async delete<T = any, R = AxiosResponse<T>>(endpoint: string): Promise<R | undefined> {
		try {
			return await axios.delete<T, R>(this.API_PREFIX + endpoint, this.getConfig());
		} catch (err: any | AxiosError) {
			await this.handleError(err);
			return;
		}
	}
}
