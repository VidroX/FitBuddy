import { createContext } from 'react';

type PageInfoContextValues = {
	title?: string;
	isGlobalLoading: boolean;
	setTitle?: (title: string | undefined) => void;
	setGlobalLoading?: (isLoading: boolean) => void;
};

export const PageInfoContext = createContext<PageInfoContextValues>({
	title: undefined,
	isGlobalLoading: false,
	setTitle: () => {},
	setGlobalLoading: () => {},
});
