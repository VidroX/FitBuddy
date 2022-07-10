import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { IconType } from 'react-icons/lib/cjs';
import { BiFootball } from 'react-icons/bi';
import { IoMdBicycle } from 'react-icons/io';
import { MdSportsHockey, MdSportsTennis, MdOutlineSportsEsports } from 'react-icons/md';

export type Activity = {
	id: string;
	name: string;
	icon: IconType | string;
};

type ActivitiesProps = {
	activities?: Activity[];
	selectedActIDs?: string[];
	onActChanged: (selectedActIDs: string[]) => void;
	className?: string;
	multi?: boolean;
	error?: string;
};

const defaultInputStyles = [
	'grid',
	'grid-cols-3',
	'w-full',
	'rounded-md',
	'focus:outline-none',
	'ease-in-out',
	'duration-100',
	'text-black',
	'dark:text-secondary-dark',
	'bg-container',
	'dark:bg-container-darker',
	'focus:ring-2',
	'focus:ring-primary/60',
	'placeholder:dark:text-white/60',
	'border-2',
];

const testActivities: Activity[] = [
	{
		id: '1',
		name: 'Football',
		icon: BiFootball,
	},
	{
		id: '2',
		name: 'Cycling',
		icon: IoMdBicycle,
	},
	{
		id: '3',
		name: 'Hockey',
		icon: MdSportsHockey,
	},
	{
		id: '4',
		name: 'Tennis',
		icon: MdSportsTennis,
	},
	{
		id: '5',
		name: 'E-Sports',
		icon: MdOutlineSportsEsports,
	},
];

export const ActivitiesSelector = ({
	activities = testActivities,
	selectedActIDs = [],
	className = undefined,
	multi = false,
	error = undefined,
	onActChanged,
	...rest
}: ActivitiesProps & React.HTMLAttributes<HTMLDivElement>) => {
	const [newSelectedActIDs, setSelectedActIDs] = useState<string[]>(selectedActIDs);

	// TODO: fetch activities from DB
	useEffect(() => {
		activities = testActivities;
	});

	const toggleActivity = (activity: Activity) => {
		if (newSelectedActIDs.includes(activity.id)) {
			setSelectedActIDs(newSelectedActIDs.filter((curActID) => curActID !== activity.id));
		} else if (multi) {
			setSelectedActIDs([...newSelectedActIDs, activity.id]);
		} else {
			setSelectedActIDs([activity.id]);
		}
	};

	useEffect(() => {
		onActChanged(newSelectedActIDs);
	}, [newSelectedActIDs, onActChanged]);

	const generateInputStyles = useCallback(() => {
		let inputStyles = defaultInputStyles;

		if (error) {
			inputStyles = [...inputStyles, 'border-red-400', 'dark:border-red-600', 'focus:dark:border-primary', 'focus:border-primary'];
		} else {
			inputStyles = [...inputStyles, 'border-transparent', 'focus:border-primary'];
		}

		return inputStyles.join(' ') + (className ? ' ' + className : '');
	}, [error, className]);

	return (
		<>
			<div className={generateInputStyles()} {...rest}>
				{activities.map((activity) => {
					const { icon, name } = activity;
					return (
						<button
							key={name}
							type="button"
							className={`flex flex-col justify-center py-2
									items-center px-3 h-full focus:outline-primary/60  rounded-md
									${newSelectedActIDs.includes(activity.id) ? ' bg-btn-primary text-secondary' : ''}`}
							onClick={() => toggleActivity(activity)}>
							{typeof icon === 'string' ? <Image src={icon} alt={name} width={48} height={48} /> : <activity.icon size={48} />}
							<p className="text-base">{name}</p>
						</button>
					);
				})}
			</div>
			{error && <small className="mt-0.5 text-sm text-red-400 dark:text-red-600">{error}</small>}
		</>
	);
};
