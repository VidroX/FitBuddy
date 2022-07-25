// eslint-disable-next-line import/named
import { CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData } from '@paypal/paypal-js';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

type PayPalProps = {
	description: string;
	value: string;
	onSuccess: (message: string) => void;
	onError: (message: string) => void;
	className?: string;
};

const PayPal = ({ description, value, onSuccess, onError, className = undefined }: PayPalProps) => {
	const createOrder = (data: CreateOrderData, actions: CreateOrderActions) => {
		return actions.order.create({
			purchase_units: [
				{
					description: description,
					amount: {
						currency_code: 'USD',
						value: value,
					},
				},
			],
			application_context: {
				shipping_preference: 'NO_SHIPPING',
			},
		});
	};

	const onApprove = (data: OnApproveData, actions: OnApproveActions) => {
		if (actions.order) {
			return actions.order.capture().then(function () {
				onSuccess('Successfull payment!');
			});
		}
		return Promise.reject(new Error('An Error occured while loading your order')).then(() => {}, onError);
	};

	return (
		<PayPalScriptProvider
			options={{
				'client-id': process.env.NEXT_PUBLIC_PAYPAL_USER_ID || '',
			}}>
			<PayPalButtons style={{ layout: 'vertical' }} createOrder={createOrder} onApprove={onApprove} className={className} forceReRender={[value]} />
		</PayPalScriptProvider>
	);
};

export default PayPal;
