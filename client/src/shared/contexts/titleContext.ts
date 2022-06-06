import { createContext } from 'react';

type TitleContextValues = {
	title?: string;
	setTitle?: (title: string) => void;
};

export const TitleContext = createContext<TitleContextValues>({
	title: undefined,
	setTitle: () => null,
});
