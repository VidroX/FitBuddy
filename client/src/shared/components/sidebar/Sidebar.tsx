//import styles from './Sidebar.module.scss';
import Link from 'next/link';
import { useCallback } from 'react';
import { IoHelpBuoySharp } from 'react-icons/io5';
import { UrlObject } from 'url';

interface IMenu {
	title: string;
	href?: string | UrlObject;
	icon: JSX.Element;
}

const MENU_ITEMS: IMenu[] = [
	{
		title: 'Sidebar',
		href: '/auth/login',
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
};

export const Sidebar = ({ expanded = false }: SidebarProps) => {
	const getSidebarClasses = useCallback(() => {
		let classes = 'bg-container-light dark:bg-container-darker absolute top-[4rem] bottom-0';

		classes += !expanded ? ' w-20' : ' w-72';

		return classes;
	}, [expanded]);

	return (
		<div className={getSidebarClasses()}>
			{MENU_ITEMS.map((item: IMenu, index: number) => (
				<Link href={item.href ?? {}} key={'menu-row-' + index}>
					<a className="text-secondary dark:text-secondary-dark hover:text-secondary dark:hover:text-secondary-dark">
						<div className="flex w-full flex-row overflow-hidden items-center hover:bg-container-dark/10 dark:hover:bg-container-light/10 duration-150">
							<div className="flex w-20 p-3 items-center justify-center">{item.icon}</div>
							<span className={!expanded ? 'hidden' : 'flex flex-1 py-3 px-2'}>{item.title}</span>
						</div>
					</a>
				</Link>
			))}
		</div>
	);
};
