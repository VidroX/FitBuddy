import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { config } from '../../../config';
import { TextField, useTitle } from '../../../shared';
import Image from 'next/image';
import sports from '../../../../public/images/sports.png';
import MediaQuery from 'react-responsive';
import { Button } from '../../../shared/components/inputs/button/Button';
import { useForm } from 'react-hook-form';
import { AuthAPI } from '../../../services/auth';
import { APIError } from '../../../services';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/features/user/userSlice';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login: NextPage = () => {
	const { t } = useTranslation('auth');
	const dispatch = useDispatch();
	const router = useRouter();

	useTitle(t('signIn'));

	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data: any) => {
		if (!data) {
			return;
		}

		const formData = new FormData();
		formData.append('email', data.email);
		formData.append('password', data.password);

		try {
			const userResponse = await AuthAPI.login(formData);

			if (userResponse) {
				dispatch(setUser(userResponse.user));

				localStorage.setItem(config.accessTokenLocation, userResponse.tokens?.access ?? '');
				localStorage.setItem(config.refreshTokenLocation, userResponse.tokens?.refresh ?? '');

				router.replace('/');
			}
		} catch (err: any | APIError) {
			if (!(err instanceof APIError) || !err?.data) {
				console.error(err);
				return;
			}

			if (err.data.payload?.errors) {
				for (const fieldError of err.data.payload.errors) {
					setError(fieldError.field_id, { type: 'custom', message: fieldError.reason });
				}
			}
		}
	};

	return (
		<div className="flex flex-row bg-container dark:bg-container-dark text-secondary dark:text-secondary-dark h-screen">
			<div className="flex-1 xl:flex-none xl:w-1/3 p-3">
				<div className="flex flex-col xl:justify-center items-center sm:h-full relative">
					<MediaQuery maxWidth={1279}>
						<div className="relative h-64 w-full mb-4 mt-12 select-none">
							<Image src={sports} loading="eager" alt="Image" layout="fill" objectFit="contain" draggable={false} priority />
						</div>
					</MediaQuery>
					<div className={'flex flex-col text-secondary dark:text-secondary-dark font-bold mb-6 antialiased items-center justify-end title'}>
						<p className="text-4xl mb-1 text-center z-10">{config.appName}</p>
						<p className="text-lg text-center z-10">Search. Connect. Workout.</p>
					</div>
					<div className="w-full z-1 bg-container-dark dark:bg-container text-secondary-dark dark:text-secondary rounded p-6 max-w-lg flex-wrap break-words drop-shadow-xl dark:shadow-white mb-6 xl:mb-0">
						<form onSubmit={handleSubmit(onSubmit)}>
							<label htmlFor="email" className="inline-block mb-1">
								E-Mail
							</label>
							<TextField
								id="email"
								placeholder="email@example.com"
								error={errors.email && (errors.email as any)?.message}
								required
								{...register('email', {
									required: { value: true, message: t('fieldRequired') },
									pattern: { value: /^\S+@\S+$/i, message: t('incorrectEmailFormat') },
								})}
							/>
							<label htmlFor="password" className="inline-block mb-1">
								{t('password')}
							</label>
							<TextField
								id="password"
								inputType="password"
								placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
								{...register('password', {
									required: { value: true, message: t('fieldRequired') },
								})}
							/>
							<p className="mb-4">
								{t('noAccountYet')} <Link href="/auth/register">{t('register')}</Link>
							</p>
							<Button className="mt-2" type="submit" onClick={() => clearErrors()} fluid>
								{t('signIn')}
							</Button>
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
