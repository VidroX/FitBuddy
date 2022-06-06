// eslint-disable-next-line import/named
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface UserState {
	value: number;
}

const initialState: UserState = {
	value: 0,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
});

//export const { increment, decrement, incrementByAmount } = userSlice.actions;
export const selectCount = (state: RootState) => state.user.value;
export default userSlice.reducer;
