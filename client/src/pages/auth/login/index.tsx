import styles from './Login.module.scss';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { config } from '../../../config';
import { Layout } from '../../../shared';
import Image from 'next/image';
import sports from '../../../../public/images/sports.png';

const Login: NextPage = () => {
	const { t } = useTranslation('auth');

	return (
		<Layout title={t('signIn')}>
			<div className="flex flex-row h-screen">
				<div className="flex-1 xl:flex-none xl:w-1/3 bg-container dark:bg-container-dark text-secondary dark:text-secondary-dark p-3">
					<div className="flex flex-col justify-center items-center h-full">
						<div className={'text-secondary dark:text-secondary-dark font-bold mb-6 antialiased '.concat(styles.title)}>
							<p className="text-4xl mb-1 text-center">{config.appName}</p>
							<p className="text-lg text-center">Search. Connect. Workout.</p>
						</div>
						<div className="w-full bg-container-dark dark:bg-container text-secondary-dark dark:text-secondary rounded p-3 max-w-lg flex-wrap break-words drop-shadow-xl">
							123
						</div>
					</div>
				</div>
				<div className="hidden xl:flex flex-1 justify-center items-center relative bg-container-dark dark:bg-container-darker">
					<div className="flex-1 w-full h-full m-24 relative">
						<Image src={sports} quality={100} alt="Image" layout="fill" objectFit="contain" priority />
					</div>
				</div>
			</div>
		</Layout>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	const translations = locale ? await serverSideTranslations(locale, ['common', 'auth']) : {};

	return {
		props: {
			...translations,
		},
	};
};

export default Login;
