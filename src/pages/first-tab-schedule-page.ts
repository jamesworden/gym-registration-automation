import { Page } from 'puppeteer';

export class FirstTabSchedulePage {
	url: string;
	page: Page;

	constructor(page: Page, url: string) {
		this.page = page;
		this.url = url;
	}

	async getTomorrowTabUrl() {
		return await this.page.evaluate((url) => {
			const tomorrowTabItems = document.querySelectorAll('.tabItem');
			const tomorrowTabItemsArray = Array.from(tomorrowTabItems);

			const days = [
				'Sunday',
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday',
			];

			const todaysDate = new Date(
				new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
			);
			const tomorrowDay = days[(todaysDate.getDay() + 1) % days.length];
			const abbreviatedTomorrowDay = tomorrowDay.substring(0, 3);

			const tomorrowTabItem = tomorrowTabItemsArray.find((element) =>
				element.innerHTML.includes(abbreviatedTomorrowDay)
			);

			const newEndingSlug = tomorrowTabItem
				.getAttribute('onclick')
				.split("('")[1]
				.replace("')", '');

			return url.split('tabs')[0] + 'go/' + newEndingSlug;
		}, this.url);
	}

	async goto() {
		await this.page.goto(this.url);
	}

	async clickCookieButtonIfExists() {
		const [cookieButton] = await this.page.$x("//button[contains(text(), 'Got it!')]");
		if (cookieButton) await cookieButton.click();
	}
}
