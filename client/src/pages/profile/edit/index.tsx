import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TextField, useTitle } from '../../../shared';
import { Button } from '../../../shared/components/inputs/button/Button';
import { TextArea } from '../../../shared/components/inputs/textarea/TextArea';
import { ActivitiesSelector } from '../../../shared/components/activities-selector/ActivitiesSelector';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/features/user/userSlice';
import { APIError } from '../../../services';
import { SelectInput } from '../../../shared/components/inputs/select/SelectInput';
import { PhotoWithEdit } from '../../../shared/components/inputs/photo-with-edit/PhotoWithEdit';
import { GENDER_OPTIONS } from '../../auth/register';
import { useAppSelector } from '../../../redux';
import { UserUpdateRequest } from '../../../services/users/types/update.request';
import { UsersAPI } from '../../../services/users';
import { useAlert } from 'react-alert';
import { useRouter } from 'next/router';

const EditProfile: NextPage = () => {
	const { t } = useTranslation('auth');
	const dispatch = useDispatch();
	const user = useAppSelector((state) => state.user.user);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const alert = useAlert();
	const router = useRouter();

	const { register, handleSubmit, setError } = useForm();

	useTitle(t('edit-profile'));

	const [selectedActivitiesError, setSelectedActivitiesError] = useState<string | undefined>(undefined);
	const [selectedActIDs, setSelectedActIDs] = useState<string[] | undefined>(user?.activities.map((activity) => activity._id));
	const [photo, setPhoto] = useState<File | null>(null);

	const onSubmit = async (data: UserUpdateRequest) => {
		setSelectedActivitiesError(undefined);

		if (!data) {
			return;
		}

		if (selectedActIDs && selectedActIDs?.length < 1) {
			setSelectedActivitiesError(t('selectAtLeastOneAct'));
			return;
		}

		data['activities'] = selectedActIDs;
		if (photo) {
			data['images'] = photo;
		}

		try {
			const userResponse = await UsersAPI.updateCurrentUser({ ...data });
			if (userResponse) {
				dispatch(setUser(userResponse));
				alert.success('Profile updated!');
				router.reload();
			}
		} catch (err: any | APIError) {
			if (!(err instanceof APIError) || !err?.data) {
				console.error(err);
				return;
			}

			if (err.data.payload?.errors) {
				for (const fieldError of err.data.payload.errors) {
					setError(fieldError.field_id, { type: 'custom', message: fieldError.reason });
					if (fieldError.field_id === 'activities') {
						setSelectedActivitiesError(fieldError.reason);
					}
				}
			}

			if (err.data.payload?.message) {
				setErrorMessage(err.data.payload.message);
			}
		}
	};

	const sortGenders = () => {
		return [...GENDER_OPTIONS].sort((a, b) => {
			if (a.value === user?.gender) {
				return -1;
			} else if (b.value === user?.gender) {
				return 1;
			} else {
				return 0;
			}
		});
	};

	return (
		<div className="w-full z-1 bg-container-dark dark:bg-container text-secondary-dark dark:text-secondary rounded p-6 max-w-lg flex-wrap break-words drop-shadow-xl dark:shadow-white mb-6 xl:mb-0 mx-auto">
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
				<PhotoWithEdit onUpload={(file) => setPhoto(file)} onCancel={() => setPhoto(null)} />
				<label htmlFor="firstName" className="inline-block mb-1">
					{t('firstName')}
				</label>
				<TextField
					id="firstName"
					placeholder={t('firstName')}
					required
					defaultValue={user?.firstname}
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
					defaultValue={user?.lastname}
					{...register('lastname', {
						required: { value: true, message: t('fieldRequired') },
					})}
				/>
				<label htmlFor="gender" className="inline-block mb-1">
					{t('gender')}
				</label>
				<SelectInput
					options={sortGenders()}
					id="gender"
					{...register('gender', {
						required: { value: true, message: t('fieldRequired') },
					})}
				/>
				<label htmlFor="about" className="inline-block mb-1">
					{t('aboutYou')}
				</label>
				<TextArea id="about" placeholder={t('aboutYou')} rows={3} defaultValue={user?.about} {...register('about')} />
				<label htmlFor="activities" className="inline-block mb-1">
					Choose favorite activity
				</label>
				<ActivitiesSelector
					id="activities"
					selectedActIDs={selectedActIDs}
					onActChanged={(selectedActIDs) => setSelectedActIDs(selectedActIDs)}
					multi={user?.subscription_level === 'premium'}
					readonly={user?.subscription_level !== 'premium'}
					error={selectedActivitiesError}
				/>
				<Button className="mt-2 mb-4" type="submit" fluid>
					{t('update')}
				</Button>
				{errorMessage && <small className="mt-1 text-sm text-red-400 dark:text-red-600">{errorMessage}</small>}
			</form>
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

export default EditProfile;
