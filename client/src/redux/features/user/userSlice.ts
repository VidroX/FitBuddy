// eslint-disable-next-line import/named
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity } from '../../../shared/components/activitiesSelector/ActivitiesSelector';

interface UserState {
	activities: Activity[];
}

const initialState: UserState = {
	activities: [],
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setActivities: (state, action: PayloadAction<Activity[]>) => {
			state.activities = action.payload;
		},
	},
});

export const { setActivities } = userSlice.actions;
export default userSlice.reducer;
