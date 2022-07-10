import '../../styles/tailwind.css';
import '../../styles/globals.scss';

import Head from 'next/head';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Suspense, useCallback, useState } from 'react';
import { Layout, PageInfoContext, PageStyle, Spinner, useTheme } from '../shared';
import { Provider } from 'react-redux';
import { store } from '../redux';
import { config } from '../config';
import { useRouter } from 'next/router';

const MyApp = ({ Component, pageProps }: AppProps) => {
	const { theme } = useTheme();

	const [title, setTitle] = useState<string | undefined>(undefined);
	const [isLoading, setLoading] = useState<boolean>(false);

	const router = useRouter();

	const getCurrentPageStyle = useCallback((currentPath: string): PageStyle => {
		switch (currentPath) {
			case '/auth':
			case '/auth/login':
			case '/auth/register':
				return PageStyle.None;
			default:
				return PageStyle.Full;
		}
	}, []);

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
					<Layout pageStyle={getCurrentPageStyle(router.pathname)}>
						<Component {...pageProps} />
					</Layout>
				</Suspense>
			</Provider>
		</PageInfoContext.Provider>
	);
};

export default appWithTranslation(MyApp);
