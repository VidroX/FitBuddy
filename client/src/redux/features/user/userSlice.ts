import { createSlice } from '@reduxjs/toolkit';

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
export default userSlice.reducer;
