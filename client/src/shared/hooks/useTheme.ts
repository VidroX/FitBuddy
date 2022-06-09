import { useCallback, useEffect, useState } from 'react';

export enum AppTheme {
	Auto = 'auto',
	Dark = 'dark',
	Light = 'light',
}

export const useTheme = (defaultTheme: AppTheme | null = null) => {
	const [theme, setTheme] = useState<string | null>(defaultTheme);
	const [properTheme, setProperTheme] = useState<string | null>(null);

	useEffect(() => {
		let storageTheme = localStorage.getItem('theme');

		if (!storageTheme || !Object.values<string>(AppTheme).includes(storageTheme)) {
			storageTheme = AppTheme.Auto;
		}

		setTheme(storageTheme);
	}, []);

	useEffect(() => {
		if (theme && Object.values<string>(AppTheme).includes(theme)) {
			localStorage.setItem('theme', theme);

			const htmlTag = document.querySelector('html');

			let properTheme = theme;

			if (properTheme === AppTheme.Auto) {
				const preferDarkMode = (window?.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')?.matches) ?? false;

				properTheme = preferDarkMode ? AppTheme.Dark : AppTheme.Light;
			}

			htmlTag?.classList.remove(...Object.values<string>(AppTheme));
			htmlTag?.classList.add(properTheme);

			setProperTheme(theme);
		}
	}, [theme]);

	return { theme: properTheme, setTheme: useCallback((newTheme: AppTheme) => setTheme(newTheme), []) };
};
