import { useTranslation } from 'next-i18next';
import { useTitle } from '../../shared';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

const Profile: NextPage = () => {
	const { t } = useTranslation('common');

	useTitle(t('profile'));

	return <div>Profile</div>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	const translations = locale ? await serverSideTranslations(locale, ['common']) : {};

	return {
		props: {
			...translations,
		},
	};
};

export default Profile;
