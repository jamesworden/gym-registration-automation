import { Page } from 'puppeteer-core';
import { uploadImageToS3 } from './upload-image-to-s3';

export async function takeScreenshot(page: Page, name: string) {
	// Small pause for page load
	await new Promise((resolve) => setTimeout(resolve, 500));
	const screenshot = await page.screenshot({ fullPage: true });
	if (screenshot) await uploadImageToS3(screenshot, name);
}
