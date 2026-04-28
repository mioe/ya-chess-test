import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { expect, test } from '@playwright/test'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const REFERENCE = path.resolve('.tmp/source/w375/w375.png')
const OUTPUT_DIR = path.resolve('.tmp/__test-snapshots__/playwright/w375')
const MAX_DIFF_RATIO = 0.1

test.describe('Perfect pixel w375', () => {
	test.use({
		viewport: { width: 375, height: 4497 },
	})

	test('главная страница совпадает с макетом на 375px', async ({ page }, testInfo) => {
		await page.emulateMedia({ reducedMotion: 'reduce' })

		await page.goto('/')

		await page.evaluate(() => document.fonts.ready)
		await page.waitForLoadState('networkidle')

		const actualBuffer = await page.screenshot({
			animations: 'disabled',
			caret: 'hide',
			type: 'png',
		})
		const actual = PNG.sync.read(actualBuffer)

		const expected = PNG.sync.read(await readFile(REFERENCE))

		expect.soft(actual.width, 'ширина скриншота должна совпадать с макетом').toBe(expected.width)
		expect.soft(actual.height, 'высота скриншота должна совпадать с макетом').toBe(expected.height)

		const { width, height } = actual
		const diff = new PNG({ width, height })
		const diffPixels = pixelmatch(actual.data, expected.data, diff.data, width, height, {
			threshold: 0.1,
		})
		const diffRatio = diffPixels / (width * height)

		const actualPng = PNG.sync.write(actual)
		const diffPng = PNG.sync.write(diff)

		await mkdir(OUTPUT_DIR, { recursive: true })
		await writeFile(path.join(OUTPUT_DIR, 'actual.png'), actualPng)
		await writeFile(path.join(OUTPUT_DIR, 'diff.png'), diffPng)

		await testInfo.attach('actual.png', { body: actualPng, contentType: 'image/png' })
		await testInfo.attach('diff.png', { body: diffPng, contentType: 'image/png' })

		expect(diffRatio, `Расхождение ${(diffRatio * 100).toFixed(2)}% превышает порог`).toBeLessThan(
			MAX_DIFF_RATIO,
		)
	})
})
