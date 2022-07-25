import '../../styles/tailwind.css';
import '../../styles/globals.scss';

import Head from 'next/head';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AlertTemplate from 'react-alert-template-basic';

import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { Layout, PageInfoContext, PageStyle, Spinner, useTheme } from '../shared';
import { Provider } from 'react-redux';
import { store } from '../redux';
import { config } from '../config';
import { useRouter } from 'next/router';
import { positions, Provider as AlertProvider } from 'react-alert';
import { UsersAPI } from '../services/users';
import { User } from '../services/auth';
import { setUser } from '../redux/features/user/userSlice';
import useSWR from 'swr';

const MyApp = ({ Component, pageProps }: AppProps) => {
	const { theme } = useTheme();

	const [title, setTitle] = useState<string | undefined>(undefined);
	const [isLoading, setLoading] = useState<boolean>(false);
	const [isRedirected, setRedirected] = useState<boolean>(false);
	const [apiUser, setApiUser] = useState<User | undefined>(undefined);

	const { data: currentUser } = useSWR<User | null>(
		() => (!apiUser ? '/users/self' : null),
		(url) => UsersAPI.getCurrentUser(url)
	);

	const router = useRouter();

	useEffect(() => {
		const storeSubscription = store.subscribe(() => {
			const {
				user: { user: userState },
			} = store.getState();

			if (userState) {
				setApiUser(userState);
			} else {
				router.replace('/auth/login').then((redirected) => setRedirected(redirected));
			}
		});

		return storeSubscription;
	}, []);

	useEffect(() => {
		if (!router.pathname.includes('/auth') && currentUser === null) {
			router.replace('/auth/login').then((redirected) => setRedirected(redirected));
			return;
		}

		if (!currentUser) {
			setRedirected(true);
			return;
		}

		store.dispatch(setUser(currentUser));

		if (router.pathname.includes('/auth')) {
			router.replace('/explore').then((redirected) => {
				setApiUser(currentUser);
				setRedirected(redirected);
			});
		} else {
			setApiUser(currentUser);
			setRedirected(true);
		}
	}, [currentUser]);

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

	if (!theme || !isRedirected || (!router.pathname.includes('/auth') && !apiUser)) {
		return <Spinner global />;
	}

	return (
		<PageInfoContext.Provider value={{ title, setTitle, isGlobalLoading: isLoading, setGlobalLoading: setLoading }}>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
				<title>{title ? `${title} • ${config.appName}` : config.appName}</title>
			</Head>
			<AlertProvider template={AlertTemplate} timeout={5000} position={positions.TOP_CENTER}>
				<Provider store={store}>
					<Suspense fallback={<Spinner global />}>
						{isLoading && <Spinner global />}
						<Layout pageStyle={getCurrentPageStyle(router.pathname)}>
							<Component {...pageProps} />
						</Layout>
					</Suspense>
				</Provider>
			</AlertProvider>
		</PageInfoContext.Provider>
	);
};

export default appWithTranslation(MyApp);
