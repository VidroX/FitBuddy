import Image from 'next/image';
import { User } from '../../../services/auth';
import { ActivityIcon } from '../activityIcon/ActivityIcon';

type CardProps = {
	user: User;
	className?: string;
};

export const Card = ({ user, className = undefined, ...rest }: CardProps & React.HTMLAttributes<HTMLDivElement>) => {
	const { firstname, lastname, images, activities, about } = user;

	return (
		<div className={'w-80' + (className ? ' ' + className : '')} {...rest}>
			<div className="rounded mb-2 shadow-lg relative w-full h-96">
				<Image className="rounded" src={images[0]} alt={firstname + ' ' + lastname} layout="fill" objectFit="cover" draggable={false} priority />
				<div className="absolute bottom-0 left-0 right-0 w-full p-2 text-secondary-dark font-semibold">
					<p className="drop-shadow">{firstname + ' ' + lastname}</p>
					<p className="line-clamp-2 drop-shadow">{about}</p>
				</div>
			</div>
			<div className="flex flex-col">
				<div className="flex flex-1 flex-row items-center flex-wrap overflow-hidden p-2">
					{activities.map((activity) => (
						<ActivityIcon activity={activity} key={activity._id} />
					))}
				</div>
			</div>
		</div>
	);
};
