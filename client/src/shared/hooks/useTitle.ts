import { useContext, useEffect } from 'react';
import { PageInfoContext } from '../contexts/pageInfoContext';

export const useTitle = (title: string | undefined = undefined): void => {
	const { setTitle } = useContext(PageInfoContext);

	useEffect(() => {
		if (setTitle) {
			setTitle(title);
		}
	}, [title, setTitle]);
};
