import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { ActivitiesAPI, Activity } from '../../../services/activities';

type ActivitiesProps = {
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

export const ActivitiesSelector = ({
	selectedActIDs = [],
	className = undefined,
	multi = false,
	error = undefined,
	onActChanged,
	...rest
}: ActivitiesProps & React.HTMLAttributes<HTMLDivElement>) => {
	const [newSelectedActIDs, setSelectedActIDs] = useState<string[]>(selectedActIDs);

	const { data: activities, error: requestError } = useSWR<Activity[] | undefined>('/activities/', () => ActivitiesAPI.getActivities());

	const toggleActivity = (activity: Activity) => {
		if (newSelectedActIDs.includes(activity._id)) {
			setSelectedActIDs(newSelectedActIDs.filter((curActID) => curActID !== activity._id));
		} else if (multi) {
			setSelectedActIDs([...newSelectedActIDs, activity._id]);
		} else {
			setSelectedActIDs([activity._id]);
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
		<div className="flex flex-col">
			<div className={generateInputStyles()} {...rest}>
				{!requestError &&
					activities?.map((activity) => {
						const { image, name } = activity;
						return (
							<button
								key={name}
								type="button"
								className={`flex flex-col justify-center py-2
									items-center px-3 h-full focus:outline-primary/60  rounded-md
									${newSelectedActIDs.includes(activity._id) ? ' bg-btn-primary text-secondary' : ''}`}
								onClick={() => toggleActivity(activity)}>
								<span
									className={`bg-secondary dark:bg-secondary-dark w-12 h-12 ${newSelectedActIDs.includes(activity._id) ? ' !bg-secondary' : ''}`}
									style={{ WebkitMask: `url('${image}') no-repeat 50% 50% / contain`, mask: `url('${image}') no-repeat 50% 50% / contain` }}
								/>
								<p className="text-base">{name}</p>
							</button>
						);
					})}
			</div>
			{error && <small className="mt-0.5 text-sm text-red-400 dark:text-red-600">{error}</small>}
		</div>
	);
};
