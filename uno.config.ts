// uno.config.ts
import extractorPug from '@unocss/extractor-pug'
import transformerDirective from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { defineConfig, presetTypography, presetWind } from 'unocss'

export default defineConfig({
	rules: [['custom-rule', { color: 'red' }]],
	extractors: [extractorPug()],
	shortcuts: [{ logo: 'i-logos-vue w-6em h-6em transform transition-800' }],
	transformers: [transformerDirective(), transformerVariantGroup()],
	presets: [
		presetWind(),
		presetTypography(),
	],
})
