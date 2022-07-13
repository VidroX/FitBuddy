export interface User {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	last_login: Date;
	about: string;
	subscription_level: SubscriptionLevel;
	subscription_end_date?: Date | null;
	gender: Gender;
	account_creation_date: Date;
	activities: Activity[];
	address: string;
	images: string[];
}

export interface Activity {
	id: string;
	name: string;
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
