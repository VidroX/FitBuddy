import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useContext, useEffect } from 'react';
import { PageInfoContext } from '../shared';

const Home: NextPage = () => {
	const { setGlobalLoading } = useContext(PageInfoContext);

	useEffect(() => {
		setGlobalLoading && setGlobalLoading(true);
	}, [setGlobalLoading]);

	return <div>Home Page</div>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	const translations = locale ? await serverSideTranslations(locale, ['common']) : {};

	return {
		props: {
			...translations,
		},
	};
};

export default Home;
