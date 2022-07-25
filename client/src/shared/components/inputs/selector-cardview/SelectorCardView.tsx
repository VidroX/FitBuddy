import React, { useState } from 'react';

export type Option = {
	id: string;
	name: string;
	text1: string;
	text2: string;
};

export type SelectorCardViewProps = {
	options: Option[];
	onSelected: (optionId: string) => void;
	className?: string;
};

const defaultStyles = [
	'flex',
	'flex-col',
	'justify-center',
	'md:flex-row',
	'gap-4',
	'bg-container-dark',
	'dark:bg-container-darker',
	'w-fit',
	'p-10',
	'rounded-xl',
	'mx-auto',
];

const selectedStyles = ['bg-btn-primary', 'text-secondary'];

const optionStyles = ['rounded-xl', 'p-4', 'md:w-80', 'flex', 'flex-col', 'gap-10'];

const SelectorCardView = ({
	options,
	onSelected,
	className = undefined,
	...rest
}: SelectorCardViewProps & React.BaseHTMLAttributes<HTMLDivElement>) => {
	const [selected, setSelected] = useState<string>();

	const onClick = (id: string) => {
		setSelected(id);
		onSelected(id);
	};

	return (
		<div className={defaultStyles.join(' ') + (className ? ' ' + className : '')} {...rest}>
			{options.map(({ id, name, text1, text2 }) => (
				<button key={id} onClick={() => onClick(id)} className={(id === selected ? selectedStyles.join(' ') + ' ' : '') + optionStyles.join(' ')}>
					<h3 className="font-bold text-xl">{name}</h3>
					<p className="font-light">{text1}</p>
					<p className="mx-auto text-lg">{text2}</p>
				</button>
			))}
		</div>
	);
};

export default SelectorCardView;
