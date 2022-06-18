//import styles from './Layout.module.scss';
import { RiMenu4Fill } from 'react-icons/ri';

export enum HeaderStyle {
	Basic = 'basic',
	Sidebar = 'sidebar',
}

type HeaderProps = {
	headerStyle?: HeaderStyle;
	onMenuClick?: () => void;
};

export const Header = ({ onMenuClick, headerStyle = HeaderStyle.Basic }: HeaderProps) => {
	const renderMenuButton = () => {
		if (headerStyle === HeaderStyle.Basic) {
			return;
		}

		return (
			<button
				className="flex w-20 justify-center py-5 px-2 hover:bg-container-dark/10 dark:hover:bg-container-light/10 duration-150"
				onClick={onMenuClick}>
				<RiMenu4Fill size={24} />
			</button>
		);
	};

	return (
		<div className="flex flex-1 flex-column items-center bg-container-light dark:bg-container-darker h-16">
			{renderMenuButton()}
			<div className="py-5 px-2">Header</div>
		</div>
	);
};
