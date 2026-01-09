import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
	plugins: [
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler']],
			},
		}),
		tsconfigPaths(),
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
}));
