//import styles from './Sidebar.module.scss';
import Link from 'next/link';
import { KeyboardEvent, useCallback } from 'react';
import { IoHelpBuoySharp } from 'react-icons/io5';
import { useMediaQuery } from 'react-responsive';
import { UrlObject } from 'url';

interface IMenu {
	title: string;
	href?: string | UrlObject;
	onClick?: () => void;
	icon: JSX.Element;
}

const MENU_ITEMS: IMenu[] = [
	{
		title: 'Sidebar',
		icon: <IoHelpBuoySharp size={24} />,
	},
	{
		title: 'Sidebar',
		href: '/auth/login',
		icon: <IoHelpBuoySharp size={24} />,
	},
];

type SidebarProps = {
	expanded?: boolean;
	onBackdropClick?: () => void;
};

export const Sidebar = ({ onBackdropClick = undefined, expanded = false }: SidebarProps) => {
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

	const getSidebarClasses = useCallback(() => {
		let classes = 'bg-container-light dark:bg-container-darker duration-150 h-full shadow';

		classes += !expanded ? (isMobile ? ' w-0' : ' w-20') : ' w-72';

		return classes;
	}, [expanded, isMobile]);

	const getBackdropClasses = useCallback(() => {
		const baseClasses = 'flex flex-row absolute top-[4rem] bottom-0';

		return expanded && isMobile ? baseClasses + ' left-0 right-0' : baseClasses;
	}, [expanded, isMobile]);

	const onKeyboardBackdropClick = (e: KeyboardEvent<HTMLDivElement>) => {
		const isAllowedKey = e.key === 'Enter' || e.key === 'Spacebar' || e.key === ' ';

		if (isAllowedKey && onBackdropClick) {
			onBackdropClick();
		}
	};

	const renderMobileBackdrop = () => {
		if (!expanded) {
			return;
		}

		return (
			<div
				className="flex flex-1 grow bg-container-dark/10 dark:bg-container-light/10"
				onKeyDown={onKeyboardBackdropClick}
				role="button"
				aria-label="Close Menu"
				onClick={onBackdropClick}
				tabIndex={0}></div>
		);
	};

	return (
		<div className={getBackdropClasses()}>
			<div className={getSidebarClasses()}>
				{MENU_ITEMS.map((item: IMenu, index: number) => (
					<Link href={item.href ?? {}} onClick={item.onClick} key={'menu-row-' + index}>
						<a className="text-secondary dark:text-secondary-dark hover:text-secondary dark:hover:text-secondary-dark" title={item.title}>
							<div className="flex w-full flex-row overflow-hidden items-center hover:bg-container-dark/10 dark:hover:bg-container-light/10 duration-150">
								<div className="flex shrink-0 w-20 p-3 items-center justify-center">{item.icon}</div>
								<span className={!expanded && !isMobile ? 'hidden' : 'flex flex-1 py-3 px-2'}>{item.title}</span>
							</div>
						</a>
					</Link>
				))}
			</div>
			{isMobile && renderMobileBackdrop()}
		</div>
	);
};
