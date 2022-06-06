module.exports = {
	content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
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
					light: '#00F5D4',
					DEFAULT: '#00F5D4',
					dark: '#00e0c0',
				},
				secondary: {
					light: '#211D1C',
					DEFAULT: '#211D1C',
					dark: '#FFFAFF',
				},
				'btn-primary': {
					light: '#4C86A8',
					DEFAULT: '#4C86A8',
					dark: '#4C86A8',
				},
				'btn-secondary': {
					light: '#5688C7',
					DEFAULT: '#5688C7',
					dark: '#5688C7',
				},
			},
		},
	},
	plugins: [],
};
