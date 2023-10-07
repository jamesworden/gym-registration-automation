import chromium from 'chrome-aws-lambda';

export const getNewBrowser = async () =>
	await chromium.puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath,
		headless: false, // chromium.headless,
		ignoreHTTPSErrors: true,
		devtools: true, // false
		slowMo: 250, // slow down by 250ms
	});
