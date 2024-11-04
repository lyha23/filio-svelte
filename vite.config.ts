// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		host: true,
		hmr: true,
	},
	plugins: [
		UnoCSS({
			configFile: 'uno.config.ts',
		}),
		sveltekit(),
	],
	build: {
		minify: 'terser',
		terserOptions: {
			compress: {
				// 生产环境时移除console
				drop_console: true,
				drop_debugger: true,
			},
		},
		target: 'esnext',
	},
	css: {
		preprocessorOptions: {
			scss: {
				// 配置 nutui 全局 scss 变量
				additionalData: ``,
			},
		},
	},
})
