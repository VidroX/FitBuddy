import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useTitle } from '../shared';

const PageNotFound = () => {
	const { t } = useTranslation('common');

	useTitle(t('404'));

	return (
		<div className="flex header-screen-full-height justify-center items-center">
			<div className="flex-col">
				<h1 className="mb-2 font-semibold text-xl">{t('404')}</h1>
				<Link href="/">
					<a className="flex flex-row items-center text-primary-dark hover:text-primary-light">
						<MdKeyboardBackspace size={16} className="mr-1" /> Return to Home Page
					</a>
				</Link>
			</div>
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

export default PageNotFound;
