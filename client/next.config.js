/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['objectstorage.ca-toronto-1.oraclecloud.com', 'localhost', 'storage.googleapis.com', 'upload.wikimedia.org'],
	},
	publicRuntimeConfig: {
		staticFolder: '/static',
	},
	experimental: {
		outputStandalone: true,
	},
	webpackDevMiddleware: (config) => {
		config.watchOptions = {
			ignored: /node_modules/,
			poll: 1000,
			aggregateTimeout: 300,
		};

		return config;
	},
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles'), path.join(__dirname, 'src')],
	},
	async redirects() {
		return [
			{
				source: '/auth',
				destination: '/auth/login',
				permanent: true,
			},
		];
	},
	i18n,
};

module.exports = nextConfig;
