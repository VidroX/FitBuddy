import axios, { AxiosError, AxiosResponse } from 'axios';
import { config } from '../config';

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
	private static async handleError(err: any | AxiosError) {
		if (!axios.isAxiosError(err) || !err?.response?.status) {
			throw new APIError('API Generic Error', err.message);
		}

		switch (err.response.status) {
			case 401: // TODO: Handle Token Refresh Logic
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

	static async post<T = any, R = AxiosResponse<T>>(endpoint: string, data: FormData): Promise<R | undefined> {
		try {
			return await axios.post<T, R>(config.apiEndpoint + '/api/v1/' + endpoint, data);
		} catch (err: any | AxiosError) {
			await this.handleError(err);
			return;
		}
	}
}
