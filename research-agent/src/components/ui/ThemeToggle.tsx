"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const { theme, setTheme, systemTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null; // Avoid hydration mismatch
	}

	const current = theme === "system" ? systemTheme : theme;
	const isDark = current === "dark";

	return (
		<button
			aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800"
		>
			{isDark ? (
				<>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
					<span>Light</span>
				</>
			) : (
				<>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
					</svg>
					<span>Dark</span>
				</>
			)}
		</button>
	);
}


