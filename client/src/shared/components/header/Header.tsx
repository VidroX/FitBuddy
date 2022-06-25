//import styles from './Layout.module.scss';
import { config } from '../../../config';
import { RiMenu4Fill } from 'react-icons/ri';
import { MdClose } from 'react-icons/md';

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
				className="flex shrink-0 w-20 justify-center py-5 px-2 hover:bg-container-dark/10 dark:hover:bg-container-light/10 duration-150"
				aria-label={isSidebarExpanded ? 'Close Menu' : 'Open Menu'}
				title={isSidebarExpanded ? 'Close Menu' : 'Open Menu'}
				onClick={onMenuClick}>
				{!isSidebarExpanded ? <RiMenu4Fill size={24} /> : <MdClose size={24} />}
			</button>
		);
	};

	return (
		<div className="flex flex-1 fixed top-0 right-0 left-0 z-40 flex-column items-center bg-container-light dark:bg-container-darker h-16 shadow">
			{renderMenuButton()}
			<div className="py-5 px-2 font-semibold text-xl title">{config.appName}</div>
		</div>
	);
};
