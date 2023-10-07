// Import required AWS SDK clients and commands for Node.js.

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({ region: 'us-east-1' });

export async function uploadImageToS3(buffer: string | Buffer, name: string) {
	const uploadParams = {
		Bucket: 'gym-register-logs',
		Key: `${name}.png`,
		Body: buffer,
		ContentType: 'image/png',
	};

	await new Promise((resolve) => setTimeout(resolve, 500)); // Small pause for page load
	const data = await s3Client.send(new PutObjectCommand(uploadParams));
	console.log('Success', data);
}
