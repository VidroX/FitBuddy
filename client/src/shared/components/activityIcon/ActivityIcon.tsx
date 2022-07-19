import Image from 'next/image';
import { Activity } from '../../../services/activities';

type ActivityIconProps = {
	activity: Activity;
	className?: string;
};

export const ActivityIcon = ({ activity, className = undefined, ...rest }: ActivityIconProps) => {
	const { name, image } = activity;

	return (
		<div className="border-primary border-2 bg-primary text-secondary flex flex-row items-center justify-center py-1 px-2 rounded-lg select-none mr-2 mb-2">
			<Image src={image} height={16} width={16} className={'mr-1' + (className ? ' ' + className : '')} alt={name} {...rest} />
			{name}
		</div>
	);
};
