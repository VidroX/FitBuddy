import { APIHandler } from '../api-handler';
import { AcceptRejectResponse, Match, MatchesResponse } from './types/matches.response';

const PREFIX = 'matches';

export class MatchesAPI {
	static async getMatches(): Promise<Match[] | undefined> {
		const resp = await APIHandler.get<MatchesResponse>(PREFIX + '/');

		return resp?.data.matches;
	}

	static async search(data: FormData): Promise<MatchesResponse | undefined> {
		const resp = await APIHandler.post<MatchesResponse>(PREFIX + '/search', data);

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
