import styles from './Spinner.module.scss';

type Props = {
	global?: boolean;
	size?: number;
};

export const Spinner = ({ global = false, size = 40 }: Props) => {
	const getSpinner = () => (
		<div className={styles.spinner} style={{ width: size, height: size }}>
			<div className={styles.dot1}></div>
			<div className={styles.dot2}></div>
		</div>
	);

	if (global) {
		return <div className={styles.global}>{getSpinner()}</div>;
	}

	return getSpinner();
};
