import { APIHandler } from '../api-handler';
import { AcceptRejectResponse, SearchResponse } from './types/search.response';

const PREFIX = 'matches';

export class SearchAPI {
	static async search(data: FormData): Promise<SearchResponse | undefined> {
		const resp = await APIHandler.post<SearchResponse>(PREFIX + '/search', data);

		if (!resp?.data) {
			return;
		}

		return resp.data;
	}

	static async accept(matchId: string): Promise<AcceptRejectResponse | undefined> {
		const formData = new FormData();
		formData.append('match_id', matchId);
		const resp = await APIHandler.post<AcceptRejectResponse>(PREFIX + '/accept', formData);

		if (!resp?.data) {
			return;
		}

		return resp.data;
	}

	static async reject(matchId: string): Promise<AcceptRejectResponse | undefined> {
		const formData = new FormData();
		formData.append('match_id', matchId);
		const resp = await APIHandler.post<AcceptRejectResponse>(PREFIX + '/reject', formData);

		if (!resp?.data) {
			return;
		}

		return resp.data;
	}
}
