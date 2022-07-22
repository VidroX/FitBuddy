import React from 'react';
import { useTranslation } from 'next-i18next';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTitle } from '../../../shared';

const EditProfile: NextPage = () => {
	const { t } = useTranslation('common');

	useTitle(t('editProfile'));

	return <div>Edit Profile</div>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	const translations = locale ? await serverSideTranslations(locale, ['common']) : {};

	return {
		props: {
			...translations,
		},
	};
};

export default EditProfile;
