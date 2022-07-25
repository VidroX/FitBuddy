import React, { ForwardedRef, useCallback, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { BsPencilFill } from 'react-icons/bs';
import styles from './PhotoWithEdit.module.scss';
import Image from 'next/image';
import { useAppSelector } from '../../../../redux/hooks';
import { AppTheme, useTheme } from '../../../hooks/useTheme';
import { Button } from '../button/Button';

export type PhotoWithEditProps = {
	onUpload: (photo: File) => void;
	className?: string;
	error?: string | null;
	onlyUpload?: boolean;
};

export const defaultPhotoStyles = ['mx-auto'];

const PhotoWithEditRef = (
	{ onUpload, className = undefined, error = null, onlyUpload = false }: PhotoWithEditProps & React.InputHTMLAttributes<HTMLInputElement>,
	ref?: ForwardedRef<HTMLInputElement>
) => {
	const [isInputView, toggleInputView] = useState<boolean>(false);
	const user = useAppSelector((state) => state.user.user);
	const theme = useTheme();

	const generateStyles = useCallback(() => {
		let inputStyles = defaultPhotoStyles;

		if (error) {
			inputStyles = [...inputStyles, 'border-red-400', 'dark:border-red-600', 'focus:dark:border-primary', 'focus:border-primary'];
		} else {
			inputStyles = [...inputStyles, 'border-transparent', 'focus:border-primary'];
		}

		return inputStyles.join(' ') + (className ? ' ' + className + ' ' : '');
	}, [error, className]);

	const generateImageLink = (): string => {
		let link = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
		if (user && user.images) {
			link = user.images[0];
		}
		return link;
	};

	return (
		<div className={generateStyles()}>
			{!isInputView && !onlyUpload && (
				<div className="relative h-40 w-40">
					<Image src={generateImageLink()} layout="fill" objectFit="cover" alt="profile" className="rounded-full" />
					<button
						onClick={() => toggleInputView(true)}
						className="absolute bottom-0 right-0 bg-btn-primary rounded-full h-10 w-10 flex justify-center items-center">
						<BsPencilFill size={24} />
					</button>
				</div>
			)}
			{(isInputView || onlyUpload) && (
				<div className="flex flex-col justify-center items-center">
					<FileUploader
						ref={ref}
						multiple={false}
						handleChange={onUpload}
						id="photo"
						name="photo"
						types={['JPEG', 'JPG', 'PNG']}
						classes={theme.theme === AppTheme.Dark ? 'mb-6 '.concat(styles.dropArea) : 'mb-6 '.concat(styles.dropAreaLight)}
					/>
					<Button onClick={() => toggleInputView(false)}>Cancel</Button>
				</div>
			)}
			{error && <small className="mt-0.5 text-sm text-red-400 dark:text-red-600">{error}</small>}
		</div>
	);
};

export const PhotoWithEdit = React.forwardRef(PhotoWithEditRef);
