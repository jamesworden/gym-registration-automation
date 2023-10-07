import { Page } from 'puppeteer';
import { uploadImageToS3 } from './upload-image-to-s3';

export async function takeScreenshot(page: Page, name: string) {
	// Small pause for page load
	await new Promise((resolve) => setTimeout(resolve, 500));
	await uploadImageToS3(await page.screenshot({ fullPage: true }), name);
}
