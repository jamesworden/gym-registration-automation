import { Member } from './member';
import { performance } from 'perf_hooks';
import { signUpMember } from './sign-up-member';
import { v4 as uuidv4 } from 'uuid';

exports.handler = handler;

/**
 *
 * event.isnotatest - must be defined for the process not to be a test
 * event.member - must be defined as well
 */
export async function handler(event: any) {
	const isTestRun: boolean = event.isnotatest ? false : true;
	console.log(`Running ${isTestRun ? 'a testing' : ''} procedure.`);

	const member: Member = event.member;
	if (!member || !memberHadRequiredFields(member)) {
		return {
			statusCode: 400,
			body: 'A valid member argument is required',
		};
	}

	const startMilliseconds = performance.now();

	const { message, timeslot } = await signUpMember(member, isTestRun);

	const endMilliseconds = performance.now();
	const milliseconds = endMilliseconds - startMilliseconds;
	const seconds = milliseconds / 1000;

	const currentDateString = new Date().toISOString();

	const response = {
		statusCode: 200,
		body: {
			registrationId: `${currentDateString}::${uuidv4()}`,
			timeRegistered: currentDateString,
			messageToServer: `Task ${
				isTestRun ? 'for testing' : ''
			} finished in ${seconds} seconds.`,
			messageToMember: message,
			member,
			timeslot,
			isTestRun,
			timeElapsed: `${seconds}s`,
		},
	};

	return response;
}

function memberHadRequiredFields(member: Member) {
	return (
		typeof member.email == 'string' &&
		typeof member.firstName == 'string' &&
		typeof member.lastName == 'string' &&
		typeof member.phone == 'string' &&
		member.schedule &&
		typeof member.xNumber == 'string'
	);
}
