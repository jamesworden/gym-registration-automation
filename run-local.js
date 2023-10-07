const member = require('./member.json');
const { handler } = require('./dist/index');

async function runLocal() {
	console.log(member);
	const response = await handler(member);

	console.log(response.statusCode);
}

runLocal();
