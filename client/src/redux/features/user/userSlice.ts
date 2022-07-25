// eslint-disable-next-line import/named
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../services/auth';

interface UserState {
	user?: User;
}

const initialState: UserState = {
	user: undefined,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User | undefined>) => {
			state.user = action.payload;
		},
		setAddress: (state, action: PayloadAction<string>) => {
			if (state.user) {
				state.user.address.name = action.payload;
			}
		},
	},
});

export const { setUser, setAddress } = userSlice.actions;
export default userSlice.reducer;
