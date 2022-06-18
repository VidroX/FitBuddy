//import styles from './Layout.module.scss';

import { FC, ReactNode, useState } from 'react';
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

	const onMenuClick = () => {
		setSidebarExpanded((isExpanded) => !isExpanded);
	};

	const getMainContentStylesWithSidebar = (): string => {
		if (pageStyle !== PageStyle.Full) {
			return '';
		}

		const baseStyles = ' py-5 px-2';

		return baseStyles + (!isSidebarExpanded ? ' ml-20' : ' ml-72');
	};

	return (
		<div>
			{pageStyle !== PageStyle.None && (
				<Header onMenuClick={onMenuClick} headerStyle={pageStyle === PageStyle.Full ? HeaderStyle.Sidebar : HeaderStyle.Basic} />
			)}
			<div className="flex flex-1 flex-row">
				{pageStyle === PageStyle.Full && <Sidebar expanded={isSidebarExpanded} />}
				<main className={'flex flex-1 flex-col'.concat(getMainContentStylesWithSidebar())}>{children}</main>
			</div>
		</div>
	);
};
