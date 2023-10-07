import { PinpointClient, SendMessagesCommand } from '@aws-sdk/client-pinpoint';

('use strict');
const pinClient = new PinpointClient({});

const originationNumber = '😬';

/**
 *
 * @param phoneNumber Example: '😬'
 * @param message Example: 'Hello James, you are registered for WEDNESDAY, June 14th for 8:50pm - 9:50pm'
 */
export const sendText = async (phoneNumber: string, message: string) => {
	const params = {
		ApplicationId: '😬', // Project ID
		MessageRequest: {
			Addresses: {
				[phoneNumber]: {
					ChannelType: 'SMS',
				},
			},
			MessageConfiguration: {
				SMSMessage: {
					Body: ` - St. John's University Fitness - \n${message}`,
					Keyword: '😬', // Registered keyword
					MessageType: 'PROMOTIONAL',
					OriginationNumber: originationNumber,
					SenderId: 'MySenderID', // Not important
				},
			},
		},
	};

	try {
		const data = await pinClient.send(new SendMessagesCommand(params));
		console.log(
			'Message sent! ' + data['MessageResponse']['Result'][phoneNumber]['StatusMessage']
		);
	} catch (err) {
		console.log(err);
	}
};
