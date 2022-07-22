import { APIHandler } from '../api-handler';
import { ActivitiesResponse, Activity } from './types/activities.response';

const PREFIX = 'activities';

export class ActivitiesAPI {
	static async getActivities(): Promise<Activity[] | undefined> {
		const resp = await APIHandler.get<ActivitiesResponse>(PREFIX + '/');

		return resp?.data.activities;
	}
}
