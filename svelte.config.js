// import adapter from '@sveltejs/adapter-node';
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import UnoCSS from '@unocss/svelte-scoped/preprocess'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [
		vitePreprocess(),
		UnoCSS({
			configOrPath: 'uno.config.ts',
		}),
		preprocess({
			typescript: {
				// 额外的 TypeScript 选项
			},
			scss: {
				// prependData: `@import "./src/styles/globals.scss";`,
			},
		}),
	],
	kit: {
		prerender: {
			// use relative URLs similar to an anchor tag <a href="/test/1"></a>
			// do not include group layout folders in the path such as /(group)/test/1
			handleHttpError: ({ path, referrer, message, error }) => {
				// ignore deliberate link to shiny 404 page
				if (
					path === '/not-found' &&
					referrer === '/blog/how-we-built-our-404-page'
				) {
					return
				}
				console.error(error)
				return new Response('Custom error page', {
					status: error,
					message,
				})
			},
		},
		alias: {
			'/@': './src',
			'/#': './types',
			'@': './src',
			$lib: './src/lib',
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: true,
			strict: true,
		}),
	},
	vitePlugin: {
		inspector: {
			showToggleButton: 'always',
			toggleKeyCombo: 'meta-shift',
		},
	},
	features: {
		inlineStyles: false,
	},
}
