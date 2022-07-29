import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTitle } from '../../shared';
import { useState } from 'react';
import styles from './Subscribe.module.scss';
import SelectorCardView, { Option } from '../../shared/components/inputs/selector-cardview/SelectorCardView';
import PayPal from '../../shared/components/paypal/PayPal';

type SubscriptionProps = {
	name: string;
	price: number;
};

const subscribeOptions = [
	{
		name: '1 month',
		price: 3.99,
	},
	{
		name: '3 months',
		price: 11,
	},
];

const Subscribe: NextPage = () => {
	const { t } = useTranslation('common');

	useTitle(t('subscribe'));

	const [message, setMessage] = useState<string>('');
	const [subscription, setSubscruption] = useState<SubscriptionProps>();

	const onSelected = (id: string) => {
		const choosenOption = subscribeOptions.find((option) => option.name === id);
		setSubscruption(choosenOption);
	};

	const generateOptions = (): Option[] =>
		subscribeOptions.map(({ name, price }) => ({
			id: name,
			name: name + ' 😇',
			text1: '🤗 Access to full activities list whenever you want! 😎',
			text2: price + ' CAD 🥳',
		}));

	return (
		<div className={'flex flex-col overflow-auto gap-10 pt-4 bg-white rounded-xl ' + styles['full-height']}>
			<SelectorCardView onSelected={onSelected} options={generateOptions()} />
			<PayPal
				description={subscription ? subscription.name : ''}
				value={subscription ? subscription.price.toString() : ''}
				onSuccess={setMessage}
				onError={setMessage}
				className="mx-auto md:w-96 w-full p-4 text-secondary dark:text-secondary-dark bg-white rounded-xl"
			/>
			{message && <small className="mt-1 text-sm">{message}</small>}
		</div>
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

export default Subscribe;
