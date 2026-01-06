import { useEffect, useLayoutEffect, useState } from 'react';

// Siempre aplicar tema oscuro - ya no hay modo claro
const applyThemeClass = () => {
	const root = document.documentElement;
	root.classList.add('dark');
	root.setAttribute('data-theme', 'dark');
	// Siempre usar variables del tema oscuro
	root.style.setProperty('--background', '#0a1422');
	root.style.setProperty('--foreground', '#f1f3f5');
};

export function useDarkMode() {
	const [isDark] = useState(true); // Siempre true - tema oscuro fijo
	const [hydrated, setHydrated] = useState(false);

	// useLayoutEffect para aplicar tema oscuro siempre
	useLayoutEffect(() => {
		try {
			// Siempre aplicar tema oscuro, sin importar localStorage o preferencias
			applyThemeClass();
			// También asegurar que localStorage esté en dark para consistencia
			localStorage.setItem('theme', 'dark');
		} catch {
			// silent
		}
		setHydrated(true);
	}, []);

	// Ya no necesitamos escuchar cambios de preferencias del SO

	// Toggle ya no cambia nada - siempre oscuro
	const toggle = () => {
		// No hace nada - tema oscuro fijo
	};

	return { isDark, toggle, hydrated };
}

export default useDarkMode;
