//import styles from './Sidebar.module.scss';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { IoCaretForward, IoCaretDown, IoPerson } from 'react-icons/io5';
import { IoIosPeople } from 'react-icons/io';
import { BsChatFill } from 'react-icons/bs';
import { RiShieldUserLine, RiLogoutBoxRLine } from 'react-icons/ri';
import { HiPencil } from 'react-icons/hi';
import { useMediaQuery } from 'react-responsive';
import { UrlObject } from 'url';
import { useRouter } from 'next/router';
import { config } from '../../../config';
import { useAppDispatch } from '../../../redux';
import { setUser } from '../../../redux/features/user/userSlice';

export enum SidebarState {
	Expanded = 'expanded',
	Collapsed = 'collapsed',
}

interface SidebarMenu {
	key: string;
	title: string;
	href?: string | UrlObject;
	selected?: boolean;
	defaultExpanded?: boolean;
	children?: SidebarMenu[];
	onClick?: () => void;
	icon?: JSX.Element;
}

type SidebarProps = {
	expanded?: boolean;
	onMenuShouldChangeState?: (state: SidebarState) => void;
};

export const MENU_ANIMATION_DURATION = 150;

export const Sidebar = ({ onMenuShouldChangeState = undefined, expanded = false }: SidebarProps) => {
	const router = useRouter();
	const [previousPath, setPreviousPath] = useState<string | undefined>(router.pathname);

	const dispatch = useAppDispatch();

	const menuItems: SidebarMenu[] = useMemo(
		() => [
			{
				key: 'profile',
				title: 'Profile',
				href: 'javascript:void(0);',
				icon: <RiShieldUserLine size={24} />,
				defaultExpanded: router.pathname.includes('/profile') || router.pathname === '/',
				children: [
					{
						key: 'your-profile',
						title: 'Your Profile',
						href: '/',
						selected: router.pathname === '/',
						icon: <IoPerson size={24} />,
					},
					{
						key: 'edit-profile',
						title: 'Edit Profile',
						href: '/profile/edit',
						selected: router.pathname === '/profile/edit',
						icon: <HiPencil size={24} />,
					},
					{
						key: 'logout',
						title: 'Logout',
						onClick: () => {
							localStorage.removeItem(config.accessTokenLocation);
							localStorage.removeItem(config.refreshTokenLocation);
							dispatch(setUser(undefined));
						},
						icon: <RiLogoutBoxRLine size={24} />,
					},
				],
			},
			{
				key: 'explore',
				title: 'Explore',
				href: '/explore',
				selected: router.pathname === '/explore',
				icon: <IoIosPeople size={24} />,
			},
			{
				key: 'chat',
				title: 'Chat',
				href: '/chat',
				selected: router.pathname === '/chat',
				icon: <BsChatFill size={24} />,
			},
		],
		[dispatch, router.pathname]
	);

	const [expandedSidebarItems, setExpandedSidebarItems] = useState<string[]>([]);
	const [isFullyExpanded, setFullyExpanded] = useState(false);

	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

	const isMenuItemExpanded = useCallback(
		(key: string) => {
			if (!key?.length || !expandedSidebarItems?.length) {
				return false;
			}

			return expandedSidebarItems.includes(key);
		},
		[expandedSidebarItems]
	);

	useEffect(() => {
		setExpandedSidebarItems((expandedItems) =>
			expanded ? menuItems.filter((item) => expandedItems.includes(item.key) || item.defaultExpanded).map((item) => item.key) : []
		);

		setTimeout(() => {
			setFullyExpanded(expanded);
		}, MENU_ANIMATION_DURATION);
	}, [expanded, menuItems]);

	useEffect(() => {
		if (menuItems?.length < 1 || previousPath === router.pathname) {
			return;
		}

		if (expanded) {
			setExpandedSidebarItems(menuItems.filter((item) => item.defaultExpanded).map((item) => item.key));
		}
		setPreviousPath(router.pathname);
	}, [menuItems, previousPath, router.pathname, expanded]);

	const getSidebarClasses = useCallback(() => {
		let classes = `bg-container-light dark:bg-container-darker duration-${MENU_ANIMATION_DURATION} h-full shadow`;

		classes += !expanded ? (isMobile ? ' w-0' : ' w-20') : ' w-72';

		return classes;
	}, [expanded, isMobile]);

	const getBackdropClasses = useCallback(() => {
		const baseClasses = 'flex flex-row fixed z-50 top-[4rem] bottom-0';

		return expanded && isMobile ? baseClasses + ' left-0 right-0' : baseClasses;
	}, [expanded, isMobile]);

	const onSidebarMenuItemClick = useCallback(
		(menuItem: SidebarMenu) => {
			const isExpandable = menuItem.children && menuItem.children?.length > 0;

			if (isExpandable) {
				if (onMenuShouldChangeState) {
					onMenuShouldChangeState(SidebarState.Expanded);
				}

				setExpandedSidebarItems(
					!isMenuItemExpanded(menuItem?.key) ? [...expandedSidebarItems, menuItem.key] : expandedSidebarItems.filter((item) => item !== menuItem.key)
				);
			}

			if (menuItem.onClick) {
				menuItem.onClick();
			}
		},
		[expandedSidebarItems, isMenuItemExpanded, onMenuShouldChangeState]
	);

	const onKeyboardBackdropClick = (e: KeyboardEvent<HTMLDivElement>) => {
		const isAllowedKey = e.key === 'Enter' || e.key === 'Spacebar' || e.key === ' ';

		if (isAllowedKey && onMenuShouldChangeState) {
			onMenuShouldChangeState(SidebarState.Collapsed);
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
				onClick={() => onMenuShouldChangeState && onMenuShouldChangeState(SidebarState.Collapsed)}
				tabIndex={0}></div>
		);
	};

	const renderCaret = (item: SidebarMenu) => {
		return <span className="flex shrink-0">{isMenuItemExpanded(item?.key) ? <IoCaretDown size={14} /> : <IoCaretForward size={14} />}</span>;
	};

	const renderMenuBasedOnButtonType = (item: SidebarMenu) => {
		const isExpandable = item.children && item.children?.length > 0;

		const buttonClasses = 'text-left text-secondary dark:text-secondary-dark hover:text-secondary dark:hover:text-secondary-dark w-full';

		const baseContent = (
			<div
				className={
					`flex w-full flex-row items-center hover:bg-container-dark/10 dark:hover:bg-container-light/10 duration-${MENU_ANIMATION_DURATION}` +
					(item.selected ? ' bg-container-dark/10 dark:bg-container-light/10' : '')
				}>
				<div className="flex shrink-0 w-20 p-3 items-center justify-center">{item.icon ?? ''}</div>
				<div className={!expanded && !isMobile ? 'hidden' : 'flex flex-1 py-3 px-2 items-center'}>
					<span className={'flex flex-1 shrink-0' + (!isFullyExpanded ? ' whitespace-nowrap' : '')}>{item.title}</span>{' '}
					{isExpandable && renderCaret(item)}
				</div>
			</div>
		);

		if (item?.onClick || (item.children && item.children.length > 0)) {
			return (
				<button className={buttonClasses} title={item.title} onClick={() => onSidebarMenuItemClick(item)}>
					{baseContent}
				</button>
			);
		}

		return (
			<a className={buttonClasses} title={item.title}>
				{baseContent}
			</a>
		);
	};

	const renderChildren = (item: SidebarMenu, parentIndex: number, level: number) => {
		if (!item.children?.length) {
			return;
		}

		return (
			<motion.div
				initial="collapsed"
				animate={isMenuItemExpanded(item?.key) ? 'expanded' : 'collapsed'}
				variants={{
					expanded: { opacity: 1, height: 'auto' },
					collapsed: { opacity: 0, height: 0 },
				}}
				transition={{ duration: MENU_ANIMATION_DURATION / 1000, ease: [0.04, 0.62, 0.23, 0.98] }}>
				{item.children.map((subItem: SidebarMenu, index: number) => (
					<div className="flex flex-col w-full overflow-hidden" key={'menu-sub-row-' + parentIndex + '-' + level + '-' + index}>
						<Link href={subItem.href ?? {}}>{renderMenuBasedOnButtonType(subItem)}</Link>

						{renderChildren(subItem, parentIndex, ++level)}
					</div>
				))}
			</motion.div>
		);
	};

	return (
		<div className={getBackdropClasses()}>
			<nav className={getSidebarClasses()}>
				{menuItems.map((item: SidebarMenu, index: number) => (
					<div
						className={
							`flex flex-col w-full overflow-hidden duration-${MENU_ANIMATION_DURATION}` +
							(isMenuItemExpanded(item?.key) || item.defaultExpanded ? ' bg-black/5 dark:bg-white/5' : '')
						}
						key={'menu-row-' + index}>
						<Link href={item.href ?? {}}>{renderMenuBasedOnButtonType(item)}</Link>

						{renderChildren(item, index, 1)}
					</div>
				))}
			</nav>
			{isMobile && renderMobileBackdrop()}
		</div>
	);
};
