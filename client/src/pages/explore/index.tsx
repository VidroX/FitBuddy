import { useTranslation } from 'next-i18next';
import { TextField, useTitle } from '../../shared';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from './Explore.module.scss';
import Image from 'next/image';
import girl from '../../../public/images/girl.png';
import { Button } from '../../shared/components/inputs/button/Button';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import { BiFootball } from 'react-icons/bi';
import { IoMdBicycle } from 'react-icons/io';
import { MdSportsTennis, MdOutlineSportsEsports } from 'react-icons/md';
import { ActivitiesSelector } from '../../shared/components/activitiesSelector/ActivitiesSelector';
import { useCallback, useState } from 'react';

const Explore: NextPage = () => {
	const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
	const { t } = useTranslation('common');

	useTitle(t('explore'));

	const onActChanged = useCallback((selectedActIDs: string[]) => {
		setSelectedActivities(selectedActIDs);
	}, []);

	return (
		<div className={'flex flex-col-reverse md:flex-row overflow-auto ' + styles['full-height']}>
			<div className="flex shrink-0 md:basis-54 mr-0 mt-4 md:mr-4 md:mt-0 justify-center items-center">
				<div className="flex flex-col w-full bg-container-light dark:bg-container-darker rounded p-3 shadow">
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
						<ActivitiesSelector selectedActIDs={selectedActivities} onActChanged={onActChanged} multi />
					</div>
					<Button fluid>{t('apply')}</Button>
				</div>
			</div>
			<div className="flex flex-1 justify-center items-center">
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
