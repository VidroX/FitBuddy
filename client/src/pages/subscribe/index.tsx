import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTitle } from '../../shared';
import { useState } from 'react';
import styles from './Subscribe.module.scss';
import SelectorCardView, { Option } from '../../shared/components/inputs/selector-cardview/SelectorCardView';
import PayPal from '../../shared/components/paypal/PayPal';
// eslint-disable-next-line import/named
import { OnApproveData } from '@paypal/paypal-js';
import { UsersAPI } from '../../services/users';
import { setUser } from '../../redux/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '../../redux';
import { SubscriptionLevel, User } from '../../services/auth';

type SubscriptionProps = {
	name: string;
	price: number;
};

const subscribeOptions: SubscriptionProps[] = [
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
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.user.user);

	useTitle(t('subscribe'));

	const [message, setMessage] = useState<string>('');
	const [subscription, setSubscruption] = useState<SubscriptionProps | undefined>(subscribeOptions[0]);

	const onSelected = (id: string) => {
		setSubscruption(subscribeOptions.find((option) => option.name === id));
	};

	const generateOptions = (): Option[] =>
		subscribeOptions.map(({ name, price }) => ({
			id: name,
			name: name + ' 😇',
			text1: '🤗 Access to full activities list whenever you want! 😎',
			text2: price + ' CAD 🥳',
		}));

	const onOrderSucceeded = async (message: string, data: OnApproveData) => {
		if (data) {
			await UsersAPI.subscribeToPremium(data.orderID);
		}
		dispatch(setUser({ ...(user as User), subscription_level: SubscriptionLevel.Premium }));
		setMessage(message);
	};

	return (
		<div className={'flex flex-col overflow-auto gap-10 pt-4 bg-white rounded-xl ' + styles['full-height']}>
			<SelectorCardView onSelected={onSelected} options={generateOptions()} />
			<PayPal
				description={subscription ? subscription.name : ''}
				value={subscription ? subscription.price.toString() : ''}
				onSuccess={onOrderSucceeded}
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
