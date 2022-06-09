import React, { useEffect, useState } from 'react';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';

type TextFieldProps = {
	inputType?: 'text' | 'password' | 'email' | 'number' | 'date';
	className?: string;
	error?: string | null;
};

const defaultInputStyles = [
	'form-input',
	'w-full',
	'py-2',
	'rounded',
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

export const TextField = ({
	inputType = 'text',
	error = null,
	className = undefined,
	...rest
}: TextFieldProps & React.HTMLAttributes<HTMLInputElement>) => {
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

	const generateInputStyles = () => {
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

		return inputStyles.join(' ') + (className ? ' ' + className : '');
	};

	return (
		<div className="mb-4">
			<div className="flex flex-1 flex-col w-full relative">
				<input className={generateInputStyles()} type={properInputType} {...rest} />
				{inputType === 'password' && (
					<div className="absolute top-0 bottom-0 right-0 flex justify-center items-center text-secondary dark:text-secondary-dark">
						<button type="button" className="px-3 h-full" onClick={changePasswordVisibility}>
							{renderPasswordVisibilityToggle()}
						</button>
					</div>
				)}
			</div>
			{error && <small className="mt-0.5 text-sm text-red-400 dark:text-red-600">{error}</small>}
		</div>
	);
};
