import styles from './Spinner.module.scss';

type Props = {
	global?: boolean;
	size?: number;
};

export const Spinner = ({ global = false, size = 40 }: Props) => {
	const getSpinner = () => (
		<div className={'animate-spinner-rotate '.concat(styles.spinner)} style={{ width: size, height: size }}>
			<div className={'animate-spinner-bounce bg-secondary dark:bg-secondary-dark '.concat(styles.dot1)}></div>
			<div className={'animate-spinner-bounce bg-secondary dark:bg-secondary-dark '.concat(styles.dot2)}></div>
		</div>
	);

	if (global) {
		return (
			<div
				className={'absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-overlay-light dark:bg-overlay-dark '.concat(
					styles.global
				)}>
				{getSpinner()}
			</div>
		);
	}

	return getSpinner();
};
