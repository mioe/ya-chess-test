import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { expect, test } from '@playwright/test'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const REFERENCE = path.resolve('.tmp/source/w1366.png')
const OUTPUT_DIR = path.resolve('.tmp/__test-snapshots__/playwright/w1366')
const MAX_DIFF_RATIO = 0.1

test.describe('Perfect pixel w1366', () => {
	test.use({
		viewport: { width: 1366, height: 3602 },
	})

	test('Главная страница совпадает с макетом на 1366px', async ({ page }, testInfo) => {
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
