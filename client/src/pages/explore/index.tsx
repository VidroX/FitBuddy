import { useTranslation } from 'next-i18next';
import { TextField, useTitle } from '../../shared';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from './Explore.module.scss';
import Image from 'next/image';
import girl from '../../../public/images/girl.png';
import { Button } from '../../shared/components/inputs/button/Button';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import { BiFootball, BiError } from 'react-icons/bi';
import { IoMdBicycle } from 'react-icons/io';
import { MdSportsTennis, MdOutlineSportsEsports } from 'react-icons/md';
import { ActivitiesSelector } from '../../shared/components/activitiesSelector/ActivitiesSelector';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AddressAutocompleteInput } from '../../shared/components/inputs/AddressAutocompleteInput/AddressAutocompleteInput';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '../../redux';
import { User } from '../../services/auth/types/auth.response';
import { useMediaQuery } from 'react-responsive';

const Explore: NextPage = () => {
	const { t } = useTranslation('common');

	useTitle(t('explore'));
	const [selectedActivitiesError, setSelectedActivitiesError] = useState<string | undefined>(undefined);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const userState = useAppSelector((state) => state.user);
	const formElement = useRef<HTMLFormElement>(null);
	const [foundUsers, setFoundUsers] = useState<User[]>([]);
	const [displayedUser, setDisplayedUser] = useState<User>(foundUsers[0]);
	const [selectedActIDs, setSelectedActIDs] = useState<string[] | undefined>(userState.user?.activities.map((activity) => activity._id));
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [isFormExpanded, setFormExpanded] = useState(true);

	const {
		register,
		handleSubmit,
		clearErrors,
		setError,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		formElement.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
	}, []);

	const onSubmit = async (data: any) => {
		setSelectedActivitiesError(undefined);

		if (!data) {
			return;
		}

		if (selectedActIDs && selectedActIDs.length < 1) {
			setSelectedActivitiesError(t('selectAtLeastOneAct'));
			return;
		}

		const formData = new FormData();
		for (const key in data) {
			formData.append(key, data[key]);
		}

		if (selectedActIDs) {
			for (const activity of selectedActIDs) {
				formData.append('activities', activity);
			}
		}

		if (userState.user) {
			formData.append('sender', userState.user.id);
		}

		// TODO: load cards to foundUsers[]
		// show first card
		// if no cards set and display error message instead of cards

		try {
			const searchResponse = await SearchAPI.search(formData);
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

	const onActChanged = useCallback((selectedActIDs: string[]) => {
		setSelectedActivities(selectedActIDs);
	}, []);

	const getNextCard = () => {
		// drop 0th user from foundUsers[]
		setFoundUsers(foundUsers.slice(1, foundUsers.length));
		// if users left show next one
		if (foundUsers.length > 0) {
			setDisplayedUser(foundUsers[0]);
			// if not show error message instead of cards
		} else {
			setErrorMessage('No users found');
		}
	};

	const onAcceptClick = () => {
		// TODO: post accept request
		// if response with mutual accept show match popup
		// getNextCard()
	};

	const onRejectClick = () => {
		// TODO: post reject request
		// getNextCard()
	};

	return (
		<div className={'flex flex-col-reverse md:flex-row overflow-auto ' + styles['full-height']}>
			<div
				className={`${
					isMobile ? 'absolute bottom-0 z-10 w-full' : ''
				} flex flex-col shrink-0 md:basis-54 mr-0 mt-4 md:mr-4 md:mt-0 justify-center items-center`}>
				{isMobile && (
					<Button className="w-full text-sm !py-1" onClick={() => setFormExpanded(!isFormExpanded)}>
						^
					</Button>
				)}
				<form
					ref={formElement}
					onSubmit={handleSubmit(onSubmit)}
					className={`
						${isFormExpanded && isMobile ? 'translate-y-full ' : 'translate-y-0 '} 
						${isMobile ? 'fixed bottom-0 ' : ''} flex-col w-full bg-container-light dark:bg-container-darker p-3 rounded shadow ease-out duration-500`}>
					<label className="mb-2" htmlFor="address">
						{t('address')}
					</label>
					<AddressAutocompleteInput
						inputClassName="dark:!bg-container-dark"
						error={errors.address && (errors.address as any)?.message}
						apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY}
						{...register('address', {
							required: { value: true, message: t('fieldRequired') },
						})}
						defaultValue={userState.user?.address}
						id="address"
					/>
					<label className="mb-2" htmlFor="distance">
						{t('distance')}
					</label>
					<div id="distance" className="flex flex-row mb-4">
						<TextField min={0} max={50} defaultValue={0} inputType="number" className="mr-2 mb-0 flex-1" inputClassName="dark:!bg-container-dark" />
						<TextField min={0} max={50} defaultValue={50} inputType="number" className="mb-0 flex-1" inputClassName="dark:!bg-container-dark" />
					</div>
					<label className="mb-2" htmlFor="activities">
						{t('activities')}
					</label>
					<div id="activities" className="flex mb-4">
						<ActivitiesSelector
							selectedActIDs={selectedActIDs}
							onActChanged={onActChanged}
							multi={userState.user?.subscription_level === 'premium'}
							error={selectedActivitiesError}
						/>
					</div>
					<Button fluid className="mb-2" type="submit" onClick={() => clearErrors()}>
						{t('apply')}
					</Button>
					{errorMessage && <small className="mt-1 text-sm text-red-400 dark:text-red-600 flex justify-center">{errorMessage}</small>}
				</form>
			</div>
			<div className="flex flex-1 justify-center items-center relative">
				{foundUsers.length > 0 && (
					<div className="w-80">
						<div className="rounded mb-2 shadow-lg relative w-full h-96">
							<Image className="rounded" src={girl} alt="Cilicia Johnson" layout="fill" objectFit="cover" draggable={false} priority />
							<div className="absolute bottom-0 left-0 right-0 w-full p-2 text-secondary-dark font-semibold">
								<p className="drop-shadow">Cilicia, 34</p>
								<p className="line-clamp-2 drop-shadow">Highly energetic woman looking for a sports buddy</p>
							</div>
						</div>
						<div className="flex flex-col">
							<div className="flex flex-1 flex-row items-center flex-wrap overflow-hidden p-2">
								<div className="border-primary border-2 bg-primary text-secondary flex flex-row items-center justify-center py-1 px-2 rounded-lg select-none mr-2 mb-2">
									<MdSportsTennis size={16} className={'mr-1'} /> Tennis
								</div>
								<div className="border-primary border-2 bg-primary text-secondary flex flex-row items-center justify-center py-1 px-2 rounded-lg select-none mr-2 mb-2">
									<IoMdBicycle size={16} className={'mr-1'} /> Cycling
								</div>
								<div className="border-primary border-2 flex flex-row items-center justify-center py-1 px-2 rounded-lg select-none mb-2">
									<BiFootball size={16} className={'mr-1'} /> Football
								</div>
								<div className="border-primary border-2 flex flex-row items-center justify-center py-1 px-2 rounded-lg select-none mb-2">
									<MdOutlineSportsEsports size={16} className={'mr-1'} /> E-Sports
								</div>
							</div>
							<div className="flex flex-1 flex-row justify-around items-center p-2">
								<Button
									noBackgroundStyles
									title="Reject"
									className="!rounded-full !p-3 !min-w-10 !min-h-10 shadow bg-container-light dark:bg-container-darker focus:!ring-red-500 hover:focus:!ring-red-500 text-red-400 hover:!bg-red-400  hover:text-secondary-dark">
									<IoClose size={24} />
								</Button>
								<Button
									noBackgroundStyles
									title="Accept"
									className="!rounded-full !p-3 !min-w-10 !min-h-10 shadow bg-container-light dark:bg-container-darker text-primary-dark hover:!bg-primary hover:text-secondary">
									<IoCheckmark size={24} />
								</Button>
							</div>
						</div>
					</div>
				)}
				{foundUsers.length === 0 && (
					<>
						<p>{t('noUser')}</p>
						<div className="dark:text-container-darker text-container-light absolute -z-10">
							<BiError size={256} />
						</div>
					</>
				)}
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

export default Explore;
