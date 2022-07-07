import 'sendbird-uikit/dist/index.css';
import { App as SendBirdApp } from 'sendbird-uikit';
import { useTranslation } from 'next-i18next';
import { useTheme, useTitle } from '../../shared';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from './Chat.module.scss';
import { config } from '../../config';

const Chat: NextPage = () => {
	const { t } = useTranslation('common');

	useTitle(t('chat'));
	const { theme } = useTheme();

	return (
		<div className={styles.App}>
			<SendBirdApp theme={theme} colorSet={config.chatColorSet} appId={config.sendBird.appId ?? ''} nickname="Bob Johnson" userId={'bobbyj'} />
		</div>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	const translations = locale ? await serverSideTranslations(locale, ['common']) : {};

	return {
		props: {
			...translations,
		},
	};
};

export default Chat;
