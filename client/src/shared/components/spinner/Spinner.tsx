import styles from './Spinner.module.scss';

type Props = {
	global?: boolean;
	size?: number;
};

export const Spinner = ({ global = false, size = 40 }: Props) => {
	const getSpinner = () => (
		<div className={'animate-spinner-rotate '.concat(styles.spinner)} style={{ width: size, height: size }}>
			<div className={'animate-spinner-bounce '.concat(styles.dot1)}></div>
			<div className={'animate-spinner-bounce '.concat(styles.dot2)}></div>
		</div>
	);

	if (global) {
		return <div className={styles.global}>{getSpinner()}</div>;
	}

	return getSpinner();
};
