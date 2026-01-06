import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

// Restauración de configuración Tailwind: colores petroleo/magnolias, sombras, animaciones y utilidades necesarias.
const config: Config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{ts,tsx,js,jsx}',
		'./app/**/*.{ts,tsx,js,jsx}',
		'./pages/**/*.{ts,tsx,js,jsx}',
		'./components/**/*.{ts,tsx,js,jsx}',
		'./snapshots/**/*.{ts,tsx,js,jsx}',
	],
	theme: {
		extend: {
			colors: {
				petroleo: '#0d4d5c',
				'petroleo-dark': '#083642',
				'petroleo-strong': '#0a3f4c',
				magnolias: '#f2e8d5',
				accent: '#ffb347',
			},
			boxShadow: {
				soft: '0 4px 12px -4px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.08)',
			},
			keyframes: {
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(8px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'scale-in': {
					'0%': { transform: 'scale(.85)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
					'fade-soft': {
						'0%': { opacity: '0' },
						'100%': { opacity: '1' }
					},
					'fade-up-soft': {
						'0%': { opacity: '0', transform: 'translateY(10px)' },
						'60%': { opacity: '1' },
						'100%': { opacity: '1', transform: 'translateY(0)' }
					},
					'scale-fade': {
						'0%': { opacity: '0', transform: 'scale(.96)' },
						'100%': { opacity: '1', transform: 'scale(1)' }
					},
						'ring-spin': {
							'0%': { transform: 'rotate(0deg)' },
							'100%': { transform: 'rotate(360deg)' },
						},
						'page-swap': {
							'0%': { opacity: '0', filter: 'blur(4px)', transform: 'translateY(6px) scale(.985)' },
							'100%': { opacity: '1', filter: 'blur(0)', transform: 'translateY(0) scale(1)' },
						},
			},
			animation: {
				'fade-in-up': 'fade-in-up 400ms ease-out both',
				'scale-in': 'scale-in 300ms cubic-bezier(.34,1.56,.4,1) both',
					'fade-soft': 'fade-soft 480ms ease-out both',
					'fade-up-soft': 'fade-up-soft 560ms cubic-bezier(.25,.9,.35,1) both',
					'scale-fade': 'scale-fade 520ms cubic-bezier(.28,.84,.42,1) both',
						'ring-spin': 'ring-spin 4s linear infinite',
						'page-swap': 'page-swap 420ms ease-out',
			},
			transitionTimingFunction: {
				'overshoot': 'cubic-bezier(.34,1.56,.4,1)',
			},
		},
	},
	plugins: [
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.no-scrollbar': {
					'scrollbar-width': 'none',
					'&::-webkit-scrollbar': { display: 'none' },
				},
			});
		})
	],
};

export default config;

