import { Page } from 'puppeteer-core';

export class LinkTreePage {
	url: string;
	page: Page;

	constructor(page: Page, url: string) {
		this.page = page;
		this.url = url;
	}

	async goto() {
		await this.page.goto(this.url);
	}

	async getAllUrls() {
		return await this.page.evaluate(() =>
			Array.from(document.querySelectorAll('a[href]'), (a) => a.getAttribute('href'))
		);
	}
}
