import { Activity } from '../../activities/types/activities.response';
import { User } from '../../auth';

export interface Match {
	user: User;
	shared_activities: Activity[];
}

export interface MatchesResponse {
	matches: Match[];
}

export interface AcceptRejectResponse {
	message: string;
	match: Match;
	is_mutually_accepted: boolean;
}
