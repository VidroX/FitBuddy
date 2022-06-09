import styles from './Login.module.scss';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { config } from '../../../config';
import { Layout, TextField } from '../../../shared';
import Image from 'next/image';
import sports from '../../../../public/images/sports.png';
import MediaQuery from 'react-responsive';

const Login: NextPage = () => {
	const { t } = useTranslation('auth');

	return (
		<Layout title={t('signIn')}>
			<div className="flex flex-row bg-container dark:bg-container-dark text-secondary dark:text-secondary-dark h-screen">
				<div className="flex-1 xl:flex-none xl:w-1/3 p-3">
					<div className="flex flex-col xl:justify-center items-center sm:h-full relative">
						<MediaQuery maxWidth={1279}>
							<div className="relative h-64 w-full mb-4 mt-12 select-none">
								<Image src={sports} loading="eager" alt="Image" layout="fill" objectFit="contain" draggable={false} priority />
							</div>
						</MediaQuery>
						<div
							className={'flex flex-col text-secondary dark:text-secondary-dark font-bold mb-6 antialiased items-center justify-end '.concat(
								styles.title
							)}>
							<p className="text-4xl mb-1 text-center z-10">{config.appName}</p>
							<p className="text-lg text-center z-10">Search. Connect. Workout.</p>
						</div>
						<div className="w-full z-1 bg-container-dark dark:bg-container text-secondary-dark dark:text-secondary rounded p-6 max-w-lg flex-wrap break-words drop-shadow-xl dark:shadow-white">
							<form>
								<label htmlFor="email">E-Mail:</label>
								<TextField id="email" placeholder="email@example.com" />
								<label htmlFor="password">{t('password')}:</label>
								<TextField id="password" inputType="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" />
							</form>
						</div>
					</div>
				</div>
				<div className="hidden xl:flex flex-1 justify-center items-center relative bg-container-dark dark:bg-container-darker">
					<div className="flex-1 w-full h-full m-24 relative">
						<Image src={sports} loading="eager" alt="Image" layout="fill" objectFit="contain" draggable={false} priority />
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
