import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './playwright',
	snapshotDir: './.tmp/__test-snapshots__',
	snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',
	use: {
		baseURL: 'http://localhost:4321',
		...devices['Desktop Chrome'],
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
})
