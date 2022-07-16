import { Activity } from '../../activities/types/activities.response';
import { User } from '../../auth';

export interface Match {
	user: User;
	shared_activities: Activity[];
}

export interface SearchResponse {
	matches: Match[];
}
