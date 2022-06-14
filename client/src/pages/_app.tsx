import '../../styles/tailwind.css';
import '../../styles/globals.scss';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next';
import { Suspense, useState } from 'react';
import { PageInfoContext, Spinner, useTheme } from '../shared';
import { Provider } from 'react-redux';
import { store } from '../redux';
import { config } from '../config';

const MyApp = ({ Component, pageProps }: AppProps) => {
	const { theme } = useTheme();
	const [title, setTitle] = useState<string | undefined>(undefined);
	const [isLoading, setLoading] = useState<boolean>(false);

	if (!theme) {
		return <Spinner global />;
	}

	return (
		<PageInfoContext.Provider value={{ title, setTitle, isGlobalLoading: isLoading, setGlobalLoading: setLoading }}>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
				<title>{title ? `${title} • ${config.appName}` : config.appName}</title>
			</Head>
			<Provider store={store}>
				<Suspense fallback={<Spinner global />}>
					{isLoading && <Spinner global />}
					<Component {...pageProps} />
				</Suspense>
			</Provider>
		</PageInfoContext.Provider>
	);
};

export default appWithTranslation(MyApp);
