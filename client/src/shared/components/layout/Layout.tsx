import { FC, ReactNode } from 'react';
import { Header } from '../header/Header';
//import styles from './Layout.module.scss';

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
	return (
		<>
			{pageStyle !== PageStyle.None && <Header />}
			<main>{children}</main>
		</>
	);
};
