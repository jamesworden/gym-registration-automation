import { Page } from 'puppeteer-core';

export class TomorrowTabSchedulePage {
	url: string;
	page: Page;

	constructor(page: Page, url: string) {
		this.page = page;
		this.url = url;
	}

	async goto() {
		await this.page.goto(this.url);
	}

	async getTitle() {
		const h1TextStrings = await this.page.evaluate(() =>
			Array.from(document.querySelectorAll('h1'), (a) => a.textContent)
		);

		return h1TextStrings[0];
	}

	async scrollToTable() {
		await this.page.evaluate(() => document.querySelector('.SUGtableouter').scrollIntoView());
	}

	async getCheckboxId(timeslot: string) {
		return await this.page.evaluate((timeslot) => {
			const timeslotSpan = Array.from(document.querySelectorAll('span')).find((el) =>
				el.textContent.includes(timeslot)
			);

			if (!timeslotSpan) {
				console.log(`Could not find timeslot: ${timeslot}`);
				return;
			}

			const checkboxInput =
				timeslotSpan.parentElement.nextElementSibling.querySelector('input');

			if (!checkboxInput) {
				console.log(`Could not find checkbox input for timeslot: ${timeslot}`);
				return;
			}

			return checkboxInput.getAttribute('id');
		}, timeslot);
	}

	async selectCheckbox(timeslot: string): Promise<boolean> {
		const checkboxId = await this.getCheckboxId(timeslot);

		if (checkboxId) {
			await this.page.click(`#${checkboxId}`);
			return true;
		} else {
			return false;
		}
	}

	async clickSubmitButton() {
		await this.page.click('.giantsubmitbutton');

		// Wait for new page to load
		await new Promise((resolve) => {
			setTimeout(resolve, 3000);
		});
	}

	async clickCookieButtonIfExists() {
		const [cookieButton] = await this.page.$x("//button[contains(text(), 'Got it!')]");
		if (cookieButton) await cookieButton.click();
	}
}
