import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActionPaths: ['payload.last_login', 'payload.account_creation_date', 'payload.subscription_end_date'],
				ignoredPaths: ['user.user.last_login', 'user.user.account_creation_date', 'user.user.subscription_end_date'],
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
