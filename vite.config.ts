// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite'
import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector'
import extractorSvelte from '@unocss/extractor-svelte'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		host: true,
		proxy: {
			// 代理 "/api" 前缀的请求到 "http://localhost:4000"
			'/api': {
				target: 'http://localhost:2345',
				changeOrigin: true, // 是否改变源
				rewrite: (path) => path.replace(/^\/api/, '/api'),
			},
			// 可以添加更多的代理规则
			'/sjtu-proxy': {
				target: 'http://jaccount.sjtu.edu.cn/oauth2/authorize',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/sjtu-proxy/, ''),
			},
		},
		fs: {
			allow: [
				// 允许访问项目根目录及上层目录
				'..',
				'node_modules/.pnpm',
			],
		},
	},
	resolve: {
		alias: {
			'@': '/src',
			'/@': '/src',
			$lib: '/src/lib',
		},
	},
	plugins: [
		UnoCSS({
			extractors: [extractorSvelte()],
			configFile: 'uno.config.ts',
		}),
		sveltekit(),
		svelteInspector(),
		// mkcert(),
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
		target: 'es6',
		rollupOptions: {
			external: ['opencascade.js'],
		},
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
