export interface Activity {
	_id: string;
	name: string;
	image: string;
}

export interface ActivitiesResponse {
	activities: Activity[];
}
