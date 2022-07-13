import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { config } from '../../../config';
import { TextField, useTitle } from '../../../shared';
import Image from 'next/image';
import sports from '../../../../public/images/sports.png';
import MediaQuery from 'react-responsive';
import { Button } from '../../../shared/components/inputs/button/Button';
import { TextArea } from '../../../shared/components/inputs/textarea/TextArea';
import { ActivitiesSelector } from '../../../shared/components/activitiesSelector/ActivitiesSelector';
import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import styles from './Register.module.scss';
import { useForm } from 'react-hook-form';
import { AddressAutocompleteInput } from '../../../shared/components/inputs/AddressAutocompleteInput/AddressAutocompleteInput';
import { AuthAPI } from '../../../services/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/features/user/userSlice';
import { useRouter } from 'next/router';
import { APIError } from '../../../services';
import Link from 'next/link';
import { SelectInput } from '../../../shared/components/inputs/selectinput/SelectInput';

const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{6,}$/i;
const GENDER_OPTIONS = [
	{ value: 'M', text: 'Male' },
	{ value: 'F', text: 'Female' },
	{ value: 'Non-binary', text: 'Non-binary' },
];

const Register: NextPage = () => {
	const { t } = useTranslation('auth');
	const dispatch = useDispatch();
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		getValues,
		clearErrors,
		setError,
		formState: { errors },
	} = useForm();

	useTitle(t('register'));

	const [selectedActivitiesError, setSelectedActivitiesError] = useState<string | undefined>(undefined);
	const [selectedActIDs, setSelectedActIDs] = useState<string[]>([]);
	const [photo, setPhoto] = useState<File | null>(null);

	const changePhoto = (photo: File) => {
		setPhoto(photo);
	};

	const onActChanged = (selectedActIDs: string[]) => {
		setSelectedActIDs(selectedActIDs);
	};

	const onSubmit = async (data: any) => {
		setSelectedActivitiesError(undefined);

		if (!data) {
			return;
		}

		if (selectedActIDs?.length < 1) {
			setSelectedActivitiesError(t('selectAtLeastOneAct'));
			return;
		}

		const formData = new FormData();
		for (const key in data) {
			formData.append(key, data[key]);
		}
		if (photo) {
			formData.append('images', photo);
		}

		formData.append('activities', selectedActIDs.join(','));
		formData.forEach((data) => console.log(data));
		try {
			const userResponse = await AuthAPI.register(formData);

			if (userResponse) {
				dispatch(setUser(userResponse.user));
				console.log(userResponse);

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

			if (err.data.payload?.message) {
				setErrorMessage(err.data.payload.message);
			}
		}
	};

	return (
		<div className="flex flex-row bg-container dark:bg-container-dark text-secondary dark:text-secondary-dark h-screen">
			<div className="overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-container-dark dark:scrollbar-thumb-container flex flex-col flex-1 xl:flex-none xl:w-1/3 p-3">
				<div className="flex flex-col xl:justify-center items-center xl:my-auto">
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
								error={errors.password && (errors.password as any)?.message}
								required
								{...register('password', {
									required: { value: true, message: t('fieldRequired') },
									pattern: { value: PASSWORD_COMPLEXITY_REGEX, message: t('passwordNotComplex') },
								})}
							/>
							<label htmlFor="repeatPassword" className="inline-block mb-1">
								{t('repeatPassword')}
							</label>
							<TextField
								id="repeatPassword"
								inputType="password"
								placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
								error={errors.repeatPassword && (errors.repeatPassword as any)?.message}
								required
								{...register('repeatPassword', {
									required: { value: true, message: t('fieldRequired') },
									pattern: { value: PASSWORD_COMPLEXITY_REGEX, message: t('passwordNotComplex') },
									validate: (val: string) => {
										const { password } = getValues();

										if (password != val) {
											return t('passwordDoNotMatch');
										}

										return true;
									},
								})}
							/>
							<label htmlFor="firstName" className="inline-block mb-1">
								{t('firstName')}
							</label>
							<TextField
								id="firstName"
								placeholder={t('firstName')}
								required
								{...register('firstname', {
									required: { value: true, message: t('fieldRequired') },
								})}
							/>
							<label htmlFor="lastName" className="inline-block mb-1">
								{t('lastName')}
							</label>
							<TextField
								id="lastName"
								placeholder={t('lastName')}
								required
								{...register('lastname', {
									required: { value: true, message: t('fieldRequired') },
								})}
							/>
							<label htmlFor="address" className="inline-block mb-1">
								{t('address')}
							</label>
							<AddressAutocompleteInput id="address" apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY} {...register('address')} />
							<label htmlFor="gender" className="inline-block mb-1">
								{t('gender')}
							</label>
							<SelectInput
								options={GENDER_OPTIONS}
								id="gender"
								{...register('gender', {
									required: { value: true, message: t('fieldRequired') },
								})}
							/>
							<label htmlFor="photo" className="inline-block mb-1">
								{t('photo')}
							</label>
							<FileUploader
								multiple={false}
								handleChange={changePhoto}
								id="photo"
								name="photo"
								types={['JPEG', 'PNG', 'GIF']}
								classes={'mb-6 '.concat(styles.dropArea)}
							/>
							<label htmlFor="about" className="inline-block mb-1">
								{t('aboutYou')}
							</label>
							<TextArea id="about" placeholder={t('aboutYou')} rows={3} {...register('about')} />
							<label htmlFor="activities" className="inline-block mb-1">
								Choose favorite activity
							</label>
							<ActivitiesSelector id="activities" onActChanged={onActChanged} error={selectedActivitiesError} />
							<p className="mb-4 mt-4">
								{t('alreadyRegistered')} <Link href="/auth/login">{t('signIn')}</Link>
							</p>
							<Button className="mt-2 mb-4" type="submit" onClick={() => clearErrors()} fluid>
								{t('register')}
							</Button>
							{errorMessage && <small className="mt-1 text-sm text-red-400 dark:text-red-600">{errorMessage}</small>}
						</form>
					</div>
				</div>
			</div>
			<div className="hidden xl:flex flex-1 justify-center items-center relative bg-container-dark dark:bg-container-darker">
				<div className="flex-1 w-full h-full m-24 relative">
					<Image src={sports} loading="eager" alt="App logo" layout="fill" objectFit="contain" draggable={false} priority />
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

export default Register;
