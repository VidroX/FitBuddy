import { useTranslation } from 'next-i18next';
import React, { ForwardedRef, useCallback, useEffect, useState } from 'react';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';

type TextFieldProps = {
	inputType?: 'text' | 'password' | 'email' | 'number' | 'date';
	className?: string;
	inputClassName?: string;
	error?: string | null;
};

export const defaultInputStyles = [
	'form-input',
	'w-full',
	'py-2',
	'rounded-md',
	'focus:outline-none',
	'ease-in-out',
	'duration-100',
	'text-black',
	'dark:text-secondary-dark',
	'bg-container',
	'dark:bg-container-darker',
	'focus:ring-2',
	'focus:ring-primary/60',
	'placeholder:dark:text-white/60',
];

const TextFieldWithRef = (
	{
		inputType = 'text',
		error = null,
		inputClassName = undefined,
		className = undefined,
		...rest
	}: TextFieldProps & React.InputHTMLAttributes<HTMLInputElement>,
	ref?: ForwardedRef<HTMLInputElement>
) => {
	const { t } = useTranslation('auth');

	const [isPasswordVisible, setPasswordVisible] = useState(false);
	const [properInputType, setProperInputType] = useState(inputType);

	const renderPasswordVisibilityToggle = () => {
		return isPasswordVisible ? <VscEyeClosed size={24} /> : <VscEye size={24} />;
	};

	const changePasswordVisibility = () => {
		setPasswordVisible((visible) => !visible);
	};

	useEffect(() => {
		if (inputType !== 'password') {
			return;
		}

		if (isPasswordVisible) {
			setProperInputType('text');
			return;
		}

		setProperInputType('password');
	}, [inputType, isPasswordVisible]);

	const generateInputStyles = useCallback(() => {
		let inputStyles = defaultInputStyles;

		if (inputType === 'password') {
			inputStyles = [...inputStyles, 'pl-4', 'pr-12'];
		} else {
			inputStyles = [...inputStyles, 'px-4'];
		}

		if (error) {
			inputStyles = [...inputStyles, 'border-red-400', 'dark:border-red-600', 'focus:dark:border-primary', 'focus:border-primary'];
		} else {
			inputStyles = [...inputStyles, 'border-transparent', 'focus:border-primary'];
		}

		return inputStyles.join(' ') + (inputClassName ? ' ' + inputClassName : '');
	}, [error, inputClassName, inputType]);

	return (
		<div className={'mb-4' + (className ? ' ' + className : '')}>
			<div className="flex flex-1 flex-col w-full relative">
				<input ref={ref} className={generateInputStyles()} type={properInputType} {...rest} />
				{inputType === 'password' && (
					<div className="absolute top-0 bottom-0 right-0 flex justify-center items-center text-secondary dark:text-secondary-dark">
						<button
							type="button"
							className="px-3 h-full focus:outline-primary/60"
							onClick={changePasswordVisibility}
							aria-label={properInputType === 'password' ? t('hidePassword') : t('showPassword')}>
							{renderPasswordVisibilityToggle()}
						</button>
					</div>
				)}
			</div>
			{error && <small className="mt-0.5 text-sm text-red-400 dark:text-red-600">{error}</small>}
		</div>
	);
};

export const TextField = React.forwardRef(TextFieldWithRef);
