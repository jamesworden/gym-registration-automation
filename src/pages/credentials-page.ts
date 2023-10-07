import { Page } from 'puppeteer';

export class CredentialsPage {
	page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async clickCookieButtonIfExists() {
		const [cookieButton] = await this.page.$x("//button[contains(text(), 'Got it!')]");
		if (cookieButton) await cookieButton.click();
	}

	async setXNumber(xNumber: string) {
		await this.page.evaluate(() => {
			document.querySelector('input').setAttribute('id', 'xNumber');
		});

		await this.page.type('#xNumber', xNumber);
	}

	async setFirstName(firstName: string) {
		await this.page.type('#firstname', firstName);
	}

	async setLastName(lastName: string) {
		await this.page.type('#lastname', lastName);
	}

	async setEmail(email: string) {
		await this.page.type('#email', email);
	}

	async clickSubmitButton() {
		const [button] = await this.page.$x("//button[contains(text(), 'Sign Up Now')]");
		if (button) await button.click();
	}

	async assertInvalidEmailError() {
		let errorExists = await this.page.evaluate(() => {
			let el = document.querySelector('.feedback-error');
			return el ? true : false;
		});

		if (!errorExists) {
			throw new Error('There should be an error about the email');
		}
	}
}
