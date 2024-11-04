import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import UnoCSS from '@unocss/svelte-scoped/preprocess'

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [
		vitePreprocess(),
		UnoCSS({
			configOrPath: 'uno.config.ts',
		}),
	],
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		adapter: adapter(),
	},
	vitePlugin: {
		inspector: {
			showToggleButton: 'always',
		},
	},
}
