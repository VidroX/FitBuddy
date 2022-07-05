// import styles from './Register.module.scss';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { config } from '../../../config';
import { TextField } from '../..';
// import Image from 'next/image';
// import sports from '../../../../public/images/sports.png';
// import MediaQuery from 'react-responsive';
import { Button } from '../inputs/button/Button';
import { TextArea } from '../inputs/textarea/TextArea';
import { ActivitiesSelector } from '../activitiesSelector/ActivitiesSelector';
import { useState } from 'react';
// import { FileUploader } from 'react-drag-drop-files';

import Image from 'next/image';
import { BsPencilFill } from 'react-icons/bs';

const EditProfile: NextPage = () => {
	const { t } = useTranslation('auth');
	const [selectedActIDs, setSelectedActIDs] = useState<string[]>([]);
	selectedActIDs;
	// const [photo, setPhoto] = useState<File | null>(null);

	// const changePhoto = (photo: File) => {
	// 	setPhoto(photo);
	// };

	const onActChanged = (selectedActIDs: string[]) => {
		setSelectedActIDs(selectedActIDs);
	};

	// const handleSubmit = (e: any) => {
	// 	e.preventDefault();
	// 	selectedActIDs;
	// 	photo;
	// 	// TODO: add password match validation, post data to server
	// };

	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<h3 className="text-left">Edit Profile</h3>
			<div className="relative photo">
				<Image src="#" alt="profile" />
				<BsPencilFill size={24} className="absolute" />
			</div>
			<form>
				<label htmlFor="email" className="inline-block mb-1">
					E-Mail
				</label>
				<TextField id="email" placeholder="email@example.com" />
				<label htmlFor="password" className="inline-block mb-1">
					{t('password')}
				</label>
				<TextField id="password" inputType="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" />
				<label htmlFor="repeatPassword" className="inline-block mb-1">
					{t('repeatPassword')}
				</label>
				<TextField id="repeatPassword" inputType="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" />
				<label htmlFor="name" className="inline-block mb-1">
					{t('Name')}
				</label>
				<TextField id="name" placeholder={t('Name')} />
				<label htmlFor="about" className="inline-block mb-1">
					{t('aboutYou')}
				</label>
				<TextArea id="about" placeholder={t('aboutYou')} rows={3} />
				<label htmlFor="activities" className="inline-block mb-1">
					Choose favorite activity
				</label>
				<ActivitiesSelector id="activities" onActChanged={onActChanged} />
				<Button className="mt-2" type="submit" fluid>
					{t('save')}
				</Button>
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
