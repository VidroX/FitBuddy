import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTitle } from '../shared';

const Profile: NextPage = () => {
	const { t: authTranslate } = useTranslation('auth');
	const { t: commonTranslate } = useTranslation('common');

	useTitle(commonTranslate('profile'));

	return <div>My Profile</div>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	const translations = locale ? await serverSideTranslations(locale, ['common', 'auth']) : {};

	return {
		props: {
			...translations,
		},
	};
};

export default Profile;
