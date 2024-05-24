import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
	build: {
		rollupOptions: {
			input: 'test.html',
			output: {
				dir: 'dist',
				manualChunks: {},
				entryFileNames: '[name].js',
				assetFileNames: '[name].[ext]',
			},
		},
	},
	plugins: [
		legacy({
			targets: ['Chrome >= 49', 'Opera >= 32', 'Safari >= 7'],
			renderModernChunks: false,
		}),
	],
});
