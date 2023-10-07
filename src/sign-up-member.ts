import {
	CredentialsPage,
	FirstTabSchedulePage,
	LinkTreePage,
	TomorrowTabSchedulePage,
} from './pages';

import { Member } from './member';
import { getNewBrowser } from './get-new-browser';
import { sendText } from './send-text';
import { takeScreenshot } from './take-screenshot';

export const signUpMember = async function (member: Member, isTestRun: boolean = true) {
	const browser = await getNewBrowser();
	const page = await browser.newPage();

	console.log(`Begin signup for ${member.firstName + ' ' + member.lastName}`);

	// CRITICAL
	const signUpType = isTestRun ? 'taffner' : 'fitness';
	member.email = isTestRun ? 'invalid.email' : member.email;

	const linkTreePage = new LinkTreePage(page, 'https://linktr.ee/Stjohnscrec');
	await linkTreePage.goto();
	await takeScreenshot(page, `linktree-crec-pre-${member.firstName}`);
	const urlsOnLinkTreePage = await linkTreePage.getAllUrls();
	const firstTabPageUrl = urlsOnLinkTreePage.find((url) => url.includes(signUpType));
	await takeScreenshot(page, `linktree-crec-post-${member.firstName}`);

	const firstTabPage = new FirstTabSchedulePage(page, firstTabPageUrl);
	await firstTabPage.goto();
	await takeScreenshot(page, `schedule-page-first-tab-pre-${member.firstName}`);
	await firstTabPage.clickCookieButtonIfExists();
	const tomorrowTabPageUrl = await firstTabPage.getTomorrowTabUrl();
	await takeScreenshot(page, `schedule-page-first-tab-post-${member.firstName}`);

	const tomorrowTabPage = new TomorrowTabSchedulePage(page, tomorrowTabPageUrl);
	await tomorrowTabPage.goto();
	await takeScreenshot(page, `schedule-page-last-tab-pre-${member.firstName}`);
	await tomorrowTabPage.clickCookieButtonIfExists();
	const pageTitle = await tomorrowTabPage.getTitle();

	let timeslot = '';
	let day = '';

	if (pageTitle.includes('Sun')) {
		timeslot = member.schedule.SUNDAY;
		day = 'Sunday';
	} else if (pageTitle.includes('Mon')) {
		timeslot = member.schedule.MONDAY;
		day = 'Monday';
	} else if (pageTitle.includes('Tue')) {
		timeslot = member.schedule.TUESDAY;
		day = 'Tuesday';
	} else if (pageTitle.includes('Wed')) {
		timeslot = member.schedule.WEDNESDAY;
		day = 'Wednesday';
	} else if (pageTitle.includes('Thu')) {
		timeslot = member.schedule.THURSDAY;
		day = 'Thursday';
	} else if (pageTitle.includes('Fri')) {
		timeslot = member.schedule.FRIDAY;
		day = 'Friday';
	} else if (pageTitle.includes('Sat')) {
		timeslot = member.schedule.SATURDAY;
		day = 'Saturday';
	} else {
		console.log(`No weekday found in title of signup form for ${pageTitle}`);
		return;
	}

	// Taffner test times.
	const isWeekend = day == 'Saturday' || day == 'Sunday';

	if (isTestRun && isWeekend) {
		timeslot = '12:00pm - 2:00pm'; // Weekends
	} else if (isTestRun) {
		timeslot = '12:20pm - 2:20pm'; // Weekdays
	}

	if (timeslot == '') {
		await browser.close();

		return {
			message: `${member.firstName} has not specified a timeslot for this ${day}`,
			timeslot: 'None',
		};
	}

	// Increase table visibility to check checkboxes
	await tomorrowTabPage.scrollToTable();
	await page.setViewport({
		width: 500,
		height: 600,
	});

	await tomorrowTabPage.selectCheckbox(timeslot);
	await takeScreenshot(page, `schedule-page-last-tab-post-${member.firstName}`);

	await tomorrowTabPage.clickSubmitButton();
	const credentialsPage = new CredentialsPage(page);
	await takeScreenshot(page, `credentials-page-pre-${member.firstName}`);
	await credentialsPage.clickCookieButtonIfExists();
	await credentialsPage.setXNumber(member.xNumber);
	await credentialsPage.setFirstName(member.firstName);
	await credentialsPage.setLastName(member.lastName);
	await credentialsPage.setEmail(member.email);
	await takeScreenshot(page, `credentials-page-post-${member.firstName}`);
	// await credentialsPage.clickSubmitButton();

	const message = `Hello ${member.firstName}, you are registered for this ${day} at: ${timeslot}.`;

	if (isTestRun) {
		await credentialsPage.assertInvalidEmailError();
		await browser.close();

		console.log('All tests pass.');
		console.log(message);

		return {
			message,
			timeslot,
		};
	}

	await browser.close();

	await sendText(member.phone, message);

	return {
		message,
		timeslot,
	};
};
