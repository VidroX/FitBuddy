//import styles from './Layout.module.scss';
import { RiMenu4Fill } from 'react-icons/ri';
import { TbArrowBack } from 'react-icons/tb';

export enum HeaderStyle {
	Basic = 'basic',
	Sidebar = 'sidebar',
}

type HeaderProps = {
	headerStyle?: HeaderStyle;
	isSidebarExpanded?: boolean;
	onMenuClick?: () => void;
};

export const Header = ({ onMenuClick, isSidebarExpanded = false, headerStyle = HeaderStyle.Basic }: HeaderProps) => {
	const renderMenuButton = () => {
		if (headerStyle === HeaderStyle.Basic) {
			return;
		}

		return (
			<button
				className="flex w-20 justify-center py-5 px-2 hover:bg-container-dark/10 dark:hover:bg-container-light/10 duration-150"
				aria-label={isSidebarExpanded ? 'Close Menu' : 'Open Menu'}
				title={isSidebarExpanded ? 'Close Menu' : 'Open Menu'}
				onClick={onMenuClick}>
				{!isSidebarExpanded ? <RiMenu4Fill size={24} /> : <TbArrowBack size={24} />}
			</button>
		);
	};

	return (
		<div className="flex flex-1 flex-column items-center bg-container-light dark:bg-container-darker h-16 shadow">
			{renderMenuButton()}
			<div className="py-5 px-2">Header</div>
		</div>
	);
};
