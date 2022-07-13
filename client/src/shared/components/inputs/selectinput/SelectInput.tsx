import React, { ForwardedRef, useCallback } from 'react';

export type SelectInputProps = {
	options: {
		text: string;
		value: string;
	}[];
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

const SelectInputWithRef = (
	{
		options,
		error = null,
		className = undefined,
		inputClassName = undefined,
		...rest
	}: SelectInputProps & React.InputHTMLAttributes<HTMLSelectElement>,
	ref?: ForwardedRef<HTMLSelectElement>
) => {
	const generateInputStyles = useCallback(() => {
		let inputStyles = defaultInputStyles;

		if (error) {
			inputStyles = [...inputStyles, 'border-red-400', 'dark:border-red-600', 'focus:dark:border-primary', 'focus:border-primary'];
		} else {
			inputStyles = [...inputStyles, 'border-transparent', 'focus:border-primary'];
		}

		return inputStyles.join(' ') + (inputClassName ? ' ' + inputClassName : '');
	}, [error, inputClassName]);

	return (
		<div className={'mb-4' + (className ? ' ' + className : '')}>
			<div className="flex flex-1 flex-col w-full relative">
				<select ref={ref} className={generateInputStyles()} {...rest}>
					{options.map(({ text, value }) => (
						<option value={value} key={value}>
							{text}
						</option>
					))}
				</select>
			</div>
			{error && <small className="mt-0.5 text-sm text-red-400 dark:text-red-600">{error}</small>}
		</div>
	);
};

export const SelectInput = React.forwardRef(SelectInputWithRef);
