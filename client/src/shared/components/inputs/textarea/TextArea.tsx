import React from 'react';

type TextAreaProps = {
	rows?: number;
	className?: string;
	error?: string | null;
};

const defaultInputStyles = [
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
	'resize-none',
];

export const TextArea = ({ rows = 3, error = null, className = undefined, ...rest }: TextAreaProps & React.HTMLAttributes<HTMLTextAreaElement>) => {
	const generateInputStyles = () => {
		let inputStyles = defaultInputStyles;

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
				<textarea className={generateInputStyles()} rows={rows} {...rest} />
			</div>
			{error && <small className="mt-0.5 text-sm text-red-400 dark:text-red-600">{error}</small>}
		</div>
	);
};
