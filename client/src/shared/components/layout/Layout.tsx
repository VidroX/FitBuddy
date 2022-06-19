//import styles from './Layout.module.scss';

import { FC, ReactNode, useCallback, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Header, HeaderStyle } from '../header/Header';
import { Sidebar } from '../sidebar/Sidebar';

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

	const onBackdropClick = () => {
		setSidebarExpanded(false);
	};

	const getMainContentStylesWithSidebar = useCallback((): string => {
		if (pageStyle !== PageStyle.Full) {
			return '';
		}

		let classes = ' py-3 px-2 duration-150';

		if (!isSidebarExpanded) {
			classes += !isTabletOrMobile ? ' ml-20' : '';
		} else {
			classes += !isTabletOrMobile ? ' ml-72' : '';
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
				{pageStyle === PageStyle.Full && <Sidebar expanded={isSidebarExpanded} onBackdropClick={onBackdropClick} />}
				<main className={'flex flex-1 flex-col'.concat(getMainContentStylesWithSidebar())}>{children}</main>
			</div>
		</div>
	);
};
