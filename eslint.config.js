import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import unicorn from 'eslint-plugin-unicorn';
import perfectionist from 'eslint-plugin-perfectionist';

export default tseslint.config(
	{
		ignores: [
			'**/dist/**',
			'**/node_modules/**',
			'web/src/components/ui/**',
			'web/src/test/**',
			'eslint.config.js',
		],
	},

	js.configs.recommended,
	...tseslint.configs.recommended,

	{
		files: ['web/**/*.{ts,tsx}', 'server/**/*.ts'],
		plugins: {
			unicorn,
			perfectionist,
		},
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				project: [
					'./server/tsconfig.json',
					'./web/tsconfig.app.json',
					'./web/tsconfig.node.json',
				],
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'error',
			'perfectionist/sort-imports': ['warn', { type: 'natural', order: 'asc' }],
			'perfectionist/sort-jsx-props': [
				'warn',
				{ type: 'natural', order: 'asc' },
			],
		},
	},

	{
		files: ['web/**/*.{ts,tsx}'],
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jest,
			},
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'unicorn/filename-case': [
				'error',
				{
					case: 'kebabCase',
					ignore: ['App.tsx', 'Vite-env.d.ts'],
				},
			],
		},
	},

	{
		files: ['server/**/*.ts'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			'unicorn/filename-case': ['warn', { case: 'kebabCase' }],
		},
	},

	// 6. 专门处理根目录或其他非 TS 项目文件（可选）
	{
		files: ['**/*.js', '**/*.mjs'],
		...tseslint.configs.disableTypeChecked,
	}
);
