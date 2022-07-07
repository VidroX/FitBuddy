import { useCallback, useEffect, useState } from 'react';

export enum AppTheme {
	Auto = 'auto',
	Dark = 'dark',
	Light = 'light',
}

type ThemeType = AppTheme.Light | AppTheme.Dark;

export interface Theme {
	theme?: ThemeType;
	setTheme: (newTheme: AppTheme) => void;
}

export const useTheme = (defaultTheme: AppTheme | null = null): Theme => {
	const [theme, setTheme] = useState<string | null>(defaultTheme);
	const [properTheme, setProperTheme] = useState<ThemeType | undefined>(undefined);

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

			let _properTheme = theme;

			if (theme === AppTheme.Auto) {
				const preferDarkMode = (window?.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')?.matches) ?? false;

				_properTheme = preferDarkMode ? AppTheme.Dark : AppTheme.Light;
			}

			htmlTag?.classList.remove(...Object.values<string>(AppTheme));
			htmlTag?.classList.add(_properTheme);

			setProperTheme(_properTheme as ThemeType);
		}
	}, [theme]);

	return { theme: properTheme, setTheme: useCallback((newTheme: AppTheme) => setTheme(newTheme), []) };
};
