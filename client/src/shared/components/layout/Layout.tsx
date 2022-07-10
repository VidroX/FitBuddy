//import styles from './Layout.module.scss';

import { FC, ReactNode, useCallback, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Header, HeaderStyle } from '../header/Header';
import { MENU_ANIMATION_DURATION, Sidebar, SidebarState } from '../sidebar/Sidebar';

export enum PageStyle {
	None = 'none',
	HeaderOnly = 'headerOnly',
	Full = 'full',
}

type LayoutProps = {
	pageStyle?: PageStyle;
	children?: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children, pageStyle = PageStyle.None }) => {
	const [isSidebarExpanded, setSidebarExpanded] = useState(false);

	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 767px)' });

	const onMenuClick = () => {
		setSidebarExpanded((isExpanded) => !isExpanded);
	};

	const onMenuShouldChangeState = (state: SidebarState) => {
		switch (state) {
			case SidebarState.Collapsed:
				setSidebarExpanded(false);
				break;
			case SidebarState.Expanded:
				setSidebarExpanded(true);
				break;
		}
	};

	const getMainContentStylesWithSidebar = useCallback((): string => {
		if (pageStyle !== PageStyle.Full) {
			return '';
		}

		let classes = ` py-3 px-2 duration-${MENU_ANIMATION_DURATION}`;

		if (!isSidebarExpanded) {
			classes += !isTabletOrMobile ? ' ml-20 mt-16' : ' mt-16';
		} else {
			classes += !isTabletOrMobile ? ' ml-72 mt-16' : ' mt-16';
		}

		return classes;
	}, [isSidebarExpanded, pageStyle, isTabletOrMobile]);

	return (
		<div>
			{pageStyle !== PageStyle.None && (
				<Header
					onMenuClick={onMenuClick}
					isSidebarExpanded={isSidebarExpanded}
					headerStyle={pageStyle === PageStyle.Full ? HeaderStyle.Sidebar : HeaderStyle.Basic}
				/>
			)}
			<div className="flex flex-1 flex-row">
				{pageStyle === PageStyle.Full && <Sidebar expanded={isSidebarExpanded} onMenuShouldChangeState={onMenuShouldChangeState} />}
				<main className={'flex flex-1 flex-col relative z-0'.concat(getMainContentStylesWithSidebar())}>{children}</main>
			</div>
		</div>
	);
};
