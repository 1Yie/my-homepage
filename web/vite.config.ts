import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
	plugins: [
		tailwindcss(),
		tsconfigPaths(),
		svgr(),
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler']],
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@server': path.resolve(__dirname, '../../server/src'),
		},
	},
	esbuild: {
		drop: command === 'build' ? ['console', 'debugger'] : [],
	},
	build: {
		sourcemap: false,
	},
}));
