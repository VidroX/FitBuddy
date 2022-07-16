import { APIHandler } from '../api-handler';
import { SearchResponse } from './types/search.response';

const PREFIX = 'matches';

export class SearchAPI {
	static async search(data: FormData): Promise<SearchResponse | undefined> {
		const resp = await APIHandler.post<SearchResponse>(PREFIX + '/search', data);

		if (!resp?.data) {
			return;
		}

		return resp.data;
	}
}
