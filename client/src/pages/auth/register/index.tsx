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
import axios from 'axios';
//import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{6,}$/i;

const Register: NextPage = () => {
	const { t } = useTranslation('auth');

	const {
		register,
		handleSubmit,
		getValues,
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

	const onSubmit = (data: any) => {
		setSelectedActivitiesError(undefined);

		if (!data) {
			return;
		}

		if (selectedActIDs?.length < 1) {
			setSelectedActivitiesError(t('selectAtLeastOneAct'));
			return;
		}

		const formData = new FormData();
<<<<<<< HEAD
		if (photo) formData.set('photo', photo);
		formData.append('firstName', data.firstName);
		formData.append('lastName', data.lastName);
		formData.append('password', data.password);
		formData.append('about', data.about);
		formData.append('email', data.email);
		formData.append('gender', data.gender);
		formData.append('address', data.address);
		formData.append('activitiesSelected', selectedActIDs.join(','));
		// 		about: "123"
		// email: "123@123"
		// firstName: "123"
		// lastName: "123"
		// password: "123qwe!"
		// repeatPassword: "123qwe!"

		//const completeData = { ...data, photo, activities: selectedActIDs, repeatPassword: undefined };

		axios.post('http://localhost:8080' + '/fitbuddy/auth/register', formData).then((resp) => console.log(resp.data));
=======

		if (photo) {
			formData.set('photo', photo);
		}

		formData.append('firstName', data.firstName);
		formData.append('lastName', data.lastName);
		formData.append('password', data.password);
		formData.append('about', data.about);
		formData.append('email', data.email);
		formData.append('gender', data.gender);
		formData.append('address', data.address);
		formData.append('activitiesSelected', selectedActIDs.join(','));

		axios.post(config.apiEndpoint + '/fitbuddy/auth/register', formData).then((resp) => console.log(resp.data));
>>>>>>> 6504329985302685b5e9b25c825f88f5193afa55
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
								{...register('firstName', {
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
								{...register('lastName', {
									required: { value: true, message: t('fieldRequired') },
								})}
							/>
							<label htmlFor="address" className="inline-block mb-1">
								{t('address')}
							</label>
							{/* <GooglePlacesAutocomplete
								apiKey={'AIzaSyDZTcATy9oRKdgW8dtLFrLFaRe6cpxrkao'}
								selectProps={{
									id: 'address',
									placeholder: t('address'),
									required: true,
									className: defaultInputStyles.join(' '),
									...register('address', {
										required: { value: true, message: t('fieldRequired') },
									}),
								}}
							/> */}
							<TextField
								id="address"
								placeholder={t('address')}
								required
								{...register('address', {
									required: { value: true, message: t('fieldRequired') },
								})}
							/>
							<label htmlFor="gender" className="inline-block mb-1">
								{t('gender')}
							</label>
							<select
								id="gender"
								{...register('gender', {
									required: { value: true, message: t('fieldRequired') },
								})}>
								<option value="M">Male</option>
								<option value="F">Female</option>
								<option value="Non-binary">Non-binary</option>
							</select>
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
							<Button className="mt-2" type="submit" fluid>
								{t('register')}
							</Button>
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
