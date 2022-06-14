import { useContext, useEffect } from 'react';
import { LoadingContext } from '../contexts/loadingContext';

export const useGlobalLoading = (isLoading = false) => {
	const { isLoading: isLoadingContext, setLoading } = useContext(LoadingContext);

	useEffect(() => {
		if (setLoading && isLoadingContext !== isLoading) {
			setLoading(isLoading);
		}
	}, [isLoading, isLoadingContext, setLoading]);

	return null;
};
