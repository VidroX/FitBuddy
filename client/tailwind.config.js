/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				container: {
					light: '#FFFAFF',
					DEFAULT: '#FFFAFF',
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
		},
	},
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
};
