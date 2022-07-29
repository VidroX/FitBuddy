import { Gender } from '../../auth';

export interface UserUpdateRequest {
	firstname?: string;
	lastname?: string;
	email?: string;
	about?: string;
	gender?: Gender;
	activities?: string[];
	address?: string;
	images?: File[];
}
