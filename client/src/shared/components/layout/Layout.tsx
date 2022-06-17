import { FC, ReactNode, useContext, useEffect } from 'react';
import { TitleContext } from '../../contexts/titleContext';
import { Header } from '../header/Header';
//import styles from './Layout.module.scss';

type LayoutProps = {
	title?: string;
	isBareBones?: boolean;
	children?: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children, isBareBones = false, title = undefined }) => {
	const { setTitle } = useContext(TitleContext);

	useEffect(() => {
		if (title && setTitle) {
			setTitle(title);
		}
	}, [setTitle, title]);

	return (
		<>
			{/* <Head key={'layout-head'}></Head> */}
			{!isBareBones && <Header />}
			<main>{children}</main>
		</>
	);
};
