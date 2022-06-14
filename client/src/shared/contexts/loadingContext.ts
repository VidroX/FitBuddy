import { createContext } from 'react';

type LoadingContextValues = {
	isLoading: boolean;
	setLoading?: (isLoading: boolean) => void;
};

export const LoadingContext = createContext<LoadingContextValues>({
	isLoading: false,
	setLoading: () => null,
});
