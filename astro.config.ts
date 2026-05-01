import { defineConfig, envField, fontProviders } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	output: 'static',
	base: process.env.NODE_ENV === 'production' ? '/ya-chess-test' : undefined,
	server: {
		port: 4321,
	},
	security: {
		// https://astro.build/blog/astro-6/#content-security-policy
		csp: process.env.NODE_ENV === 'production',
		checkOrigin: true,
	},
	experimental: {
		rustCompiler: true,
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Golos Text',
			cssVariable: '--font-golos-text',
			options: {
				variants: [
					{
						src: ['./public/assets/fonts/GolosText/webfonts/GolosText-Regular.woff2'],
						weight: '400',
						style: 'normal',
					},
					{
						src: ['./public/assets/fonts/GolosText/webfonts/GolosText-Medium.woff2'],
						weight: '500',
						style: 'normal',
					},
					{
						src: ['./public/assets/fonts/GolosText/webfonts/GolosText-SemiBold.woff2'],
						weight: '600',
						style: 'normal',
					},
					{
						src: ['./public/assets/fonts/GolosText/webfonts/GolosText-Bold.woff2'],
						weight: '700',
						style: 'normal',
					},
					{
						src: ['./public/assets/fonts/GolosText/webfonts/GolosText-ExtraBold.woff2'],
						weight: '800',
						style: 'normal',
					},
					{
						src: ['./public/assets/fonts/GolosText/webfonts/GolosText-Black.woff2'],
						weight: '900',
						style: 'normal',
					},
				],
			},
		},
		{
			provider: fontProviders.local(),
			name: 'Merriweather',
			cssVariable: '--font-merriweather',
			options: {
				variants: [
					{
						src: [
							'./public/assets/fonts/Merriweather/webfonts/Merriweather-VariableFont_opsz,wdth,wght.woff2',
						],
						weight: '300 900',
						stretch: '87% 112%',
						style: 'normal',
					},
					{
						src: [
							'./public/assets/fonts/Merriweather/webfonts/Merriweather-Italic-VariableFont_opsz,wdth,wght.woff2',
						],
						weight: '300 900',
						stretch: '87% 112%',
						style: 'italic',
					},
				],
			},
		},
	],
	env: {
		schema: {
			// app/variables
			URL_HH: envField.string({ context: 'server', access: 'public' }),
			URL_HABR: envField.string({ context: 'server', access: 'public' }),
		},
		validateSecrets: true,
	},
})
