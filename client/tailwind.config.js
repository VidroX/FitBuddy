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
					light: '#29ffe2',
					DEFAULT: '#00F5D4',
					dark: '#00c2a8',
				},
				secondary: {
					light: '#211D1C',
					DEFAULT: '#211D1C',
					dark: '#FFFAFF',
				},
				'btn-primary': '#4C86A8',
				'btn-secondary': '#5688C7',
			},
		},
	},
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
};
