import { useTranslation } from 'next-i18next';
import { useTitle } from '../../shared';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import styles from './Chat.module.scss';
import dynamic from 'next/dynamic';

const ChatApp = dynamic(() => import('./components/chat-app/chat-app'), { ssr: false });

const Chat: NextPage = () => {
	const { t } = useTranslation('common');
	useTitle(t('chat'));

	return (
		<div className={`py-3 px-2 md:p-0 ${styles.chat}`}>
			<ChatApp />
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
