/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				overlay: {
					light: 'rgba(205, 205, 205, .25)',
					dark: 'rgba(50, 50, 50, .25)',
				},
				container: {
					light: '#FFFAFF',
					DEFAULT: '#F5F5F5',
					dark: '#333333',
					darker: '#262626',
				},
				primary: {
					light: '#37ecac',
					DEFAULT: '#72faca',
					dark: '#13c485',
				},
				secondary: {
					light: '#211D1C',
					DEFAULT: '#211D1C',
					dark: '#FFFAFF',
				},
				'btn-primary': '#37ecac',
				'btn-secondary': '#72faca',
			},
			keyframes: {
				'sk-bounce': {
					'0%, 100%': { transform: 'scale(0)' },
					'50%': { transform: 'scale(1.0)' },
				},
				'sk-rotate': {
					'100%': { transform: 'rotate(360deg)' },
				},
			},
			animation: {
				'spinner-bounce': 'sk-bounce 2.0s infinite ease-in-out',
				'spinner-rotate': 'sk-rotate 2.0s infinite linear',
			},
		},
	},
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp'), require('tailwind-scrollbar')],
};
