export const config = {
	appName: 'FitBuddy',
	apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
	sendBird: {
		appId: process.env.NEXT_PUBLIC_SENDBIRD_APP_ID,
	},
	chatColorSet: {
		'--sendbird-light-primary-500': '#72faca',
		'--sendbird-light-primary-400': '#72faca',
		'--sendbird-light-primary-300': '#72faca',
		'--sendbird-light-primary-200': '#72faca',
		'--sendbird-light-primary-100': '#72faca',
		'--sendbird-dark-primary-500': '#72faca',
		'--sendbird-dark-primary-400': '#72faca',
		'--sendbird-dark-primary-300': '#72faca',
		'--sendbird-dark-primary-200': '#72faca',
		'--sendbird-dark-primary-100': '#72faca',
		'--sendbird-dark-background-600': '#262626',
		'--sendbird-dark-background-700': '#2b2b2b',
	},
};
