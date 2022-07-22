import { Activity } from '../../activities/types/activities.response';

export type Coordinates = {
	latitude: number;
	longitude: number;
};

export type Address = {
	name: string;
	coordinates: Coordinates;
};

export interface User {
	_id: string;
	firstname: string;
	lastname: string;
	email: string;
	last_login: Date;
	about: string;
	subscription_level: SubscriptionLevel;
	subscription_end_date?: Date | null;
	activities_change_date?: Date | null;
	gender: Gender;
	account_creation_date: Date;
	activities: Activity[];
	address: Address;
	images: string[];
	chat_access_token?: string | null;
}

export enum SubscriptionLevel {
	Free = 'free',
	Premium = 'premium',
}

export enum Gender {
	Male = 'm',
	Female = 'f',
	NonBinary = 'Non-binary',
}

export interface Tokens {
	access: string;
	refresh?: string;
}

export interface UserResponse {
	user: User;
	tokens?: Tokens;
}
