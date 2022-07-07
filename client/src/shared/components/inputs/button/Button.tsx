import React, { ReactNode } from 'react';

type ButtonProps = {
	type?: 'submit' | 'button';
	className?: string;
	fluid?: boolean;
	noBackgroundStyles?: boolean;
	children?: ReactNode;
};

const defaultButtonStyles = [
	'form-input',
	'py-2',
	'px-6',
	'rounded-md',
	'ease-in-out',
	'duration-150',
	'focus:ring',
	'border-transparent',
	'focus:border-transparent',
	'focus:ring-btn-secondary',
	'hover:focus:ring-btn-primary',
	'shadow-md',
	'focus:shadow-none',
	'font-bold',
];

export const Button: React.FC<ButtonProps & React.HTMLAttributes<HTMLButtonElement>> = ({
	children,
	type = 'button',
	className = undefined,
	fluid = false,
	noBackgroundStyles = false,
	...rest
}) => {
	const generateButtonStyles = () => {
		let buttonStyles = defaultButtonStyles;

		if (fluid) {
			buttonStyles = [...buttonStyles, 'w-full'];
		}

		if (!noBackgroundStyles) {
			buttonStyles = [...buttonStyles, 'bg-btn-primary', 'hover:bg-btn-secondary', 'text-secondary'];
		}

		return buttonStyles.join(' ') + (className ? ' ' + className : '');
	};

	return (
		<button className={generateButtonStyles()} type={type} {...rest}>
			{children}
		</button>
	);
};
