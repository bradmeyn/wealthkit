import type { Config } from 'tailwindcss';
const colors = require('tailwindcss/colors');

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	plugins: [require('flowbite/plugin')],
	darkMode: 'class',
	theme: {
		extend: {
			container: {
				center: true,
				padding: {
					DEFAULT: '1rem'
				}
			},

			colors: {
				// flowbite-svelte
				primary: {
					50: '#ECFDF5', // lightest emerald
					100: '#D1FAE5',
					200: '#A7F3D0',
					300: '#6EE7B7',
					400: '#34D399',
					500: '#10B981', // standard emerald
					600: '#059669',
					700: '#047857',
					800: '#065F46',
					900: '#064E3B' // darkest emerald
				},

				brand: {
					default: colors.emerald[500],
					dark: colors.emerald[700],
					light: colors.emerald[300]
				}
			}
		}
	}
};
