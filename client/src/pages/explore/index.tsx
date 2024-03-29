import { useTranslation } from 'next-i18next';
import { TextField, useTitle } from '../../shared';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from './Explore.module.scss';
import { Button } from '../../shared/components/inputs/button/Button';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import { BiError } from 'react-icons/bi';
import { ActivitiesSelector } from '../../shared/components/activities-selector/ActivitiesSelector';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AddressAutocompleteInput } from '../../shared/components/inputs/address-autocomplete-input/AddressAutocompleteInput';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../redux';
import { useMediaQuery } from 'react-responsive';
import { Match, MatchesAPI } from '../../services/matches';
import { APIError } from '../../services/api-handler';
import { Card } from '../../shared/components/card/Card';
import { useAlert } from 'react-alert';
import { setUser } from '../../redux/features/user/userSlice';
import { Activity } from '../../services/activities';
import { differenceInMonths } from 'date-fns';
import { SubscriptionLevel } from '../../services/auth';

const Explore: NextPage = () => {
	const { t } = useTranslation('common');
	const alert = useAlert();

	useTitle(t('explore'));
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const user = useAppSelector((state) => state.user.user);
	const dispatch = useAppDispatch();
	const formElement = useRef<HTMLFormElement>(null);
	const [foundUsers, setFoundUsers] = useState<Match[]>();
	const [displayedUser, setDisplayedUser] = useState<Match | undefined>();
	const [selectedActIDs, setSelectedActIDs] = useState<string[] | undefined>(user?.activities.map((activity) => activity._id));
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [isFormExpanded, setFormExpanded] = useState(true);
	const [selectedActivitiesError, setSelectedActivitiesError] = useState<string | undefined>();

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

		if (user) {
			formData.append('sender', user._id);
		}

		try {
			const searchResponse = await MatchesAPI.search(formData);
			setFoundUsers(searchResponse?.matches);
			setDisplayedUser(foundUsers?.[0]);

			if (!user) {
				return;
			}

			const newActivities = (selectedActIDs ?? []).map(
				(id) =>
					({
						_id: id,
					} as Activity)
			);

			dispatch(
				setUser({
					...user,
					address: data.address,
					activities_change_date: !user.activities.every((act) => newActivities.every((act2) => act._id === act2._id))
						? new Date()
						: user.activities_change_date,
					activities: newActivities,
				})
			);
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

	useEffect(() => {
		if (foundUsers && foundUsers.length > 0) {
			setDisplayedUser(foundUsers[0]);
			setErrorMessage(null);
		} else {
			setDisplayedUser(undefined);
		}
	}, [foundUsers]);

	const onActChanged = useCallback(async (newSelectedActIDs: string[]) => {
		setSelectedActIDs(newSelectedActIDs);
	}, []);

	const getNextCard = () => {
		setFoundUsers(foundUsers?.slice(1, foundUsers.length));
	};

	const onAcceptClick = async () => {
		if (displayedUser) {
			const acceptResponse = await MatchesAPI.accept(displayedUser.user._id);
			if (acceptResponse?.is_mutually_accepted) {
				alert.success("You've got a match!");
			}
			getNextCard();
		}
	};

	const onRejectClick = async () => {
		if (displayedUser) {
			await MatchesAPI.reject(displayedUser.user._id);
			getNextCard();
		}
	};

	return (
		<div className={'flex flex-col-reverse md:flex-row overflow-auto ' + styles['full-height']}>
			<div
				className={`
				${isFormExpanded && isMobile ? 'translate-y-[calc(100%-2rem)] ' : 'translate-y-0 '}
				${
					isMobile ? 'fixed bottom-0 z-10 w-full' : ''
				} ease-out duration-500 flex flex-col shrink-0 md:basis-54 mr-0 mt-4 md:mr-4 md:mt-0 justify-center items-center`}>
				{isMobile && (
					<Button className="w-full text-sm py-0 h-8" onClick={() => setFormExpanded(!isFormExpanded)}>
						{isFormExpanded && '↑'}
						{!isFormExpanded && '↓'}
					</Button>
				)}
				<form
					ref={formElement}
					onSubmit={handleSubmit(onSubmit)}
					className={`
						${isMobile ? 'flex flex-col items-center w-full' : 'w-96'}
						flex-col bg-container-light dark:bg-container-darker p-3 rounded shadow`}>
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
						defaultValue={user?.address.name || (user?.address as any as string)}
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
							readonly={user?.subscription_level !== 'premium' && differenceInMonths(new Date(), user?.activities_change_date ?? new Date()) < 1}
							selectedActIDs={selectedActIDs}
							onActChanged={onActChanged}
							multi={user?.subscription_level === 'premium'}
							error={selectedActivitiesError}
						/>
					</div>
					<Button fluid className="mb-2" type="submit" onClick={() => clearErrors()}>
						{t('apply')}
					</Button>
					{user?.subscription_level !== SubscriptionLevel.Premium &&
						differenceInMonths(new Date(), user?.activities_change_date ?? new Date()) < 1 && (
							<small className="mt-1 text-sm text-yellow-400 dark:text-yellow-600 flex justify-center">
								{`Consider buying premium to update activities earlier than 1 month after ${
									user?.activities_change_date?.toDateString() ?? new Date().toDateString()
								}`}
							</small>
						)}
					{errorMessage && <small className="mt-1 text-sm text-red-400 dark:text-red-600 flex justify-center">{errorMessage}</small>}
				</form>
			</div>
			<div className="flex justify-center m-auto h-fit">
				{displayedUser && (
					<div className="w-80 rounded-3xl mb-2 shadow-lg">
						<div className="rounded mb-2 relative w-full">
							<Card user={displayedUser?.user} />
							<div className="flex flex-1 flex-row justify-around items-center p-2">
								<Button
									noBackgroundStyles
									onClick={onRejectClick}
									title="Reject"
									className="!rounded-full !p-3 !min-w-10 !min-h-10 shadow bg-container-light dark:bg-container-darker focus:!ring-red-500 hover:focus:!ring-red-500 text-red-400 hover:!bg-red-400  hover:text-secondary-dark">
									<IoClose size={24} />
								</Button>
								<Button
									noBackgroundStyles
									onClick={onAcceptClick}
									title="Accept"
									className="!rounded-full !p-3 !min-w-10 !min-h-10 shadow bg-container-light dark:bg-container-darker text-primary-dark hover:!bg-primary hover:text-secondary">
									<IoCheckmark size={24} />
								</Button>
							</div>
						</div>
					</div>
				)}
				{!displayedUser && (
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
