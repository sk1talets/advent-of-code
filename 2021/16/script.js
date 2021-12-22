const fs = require('fs');

let versionsSum = 0;

function parseBinary(input, pos, length) {
	return [pos + length, parseInt(input.substr(pos, length), 2)];
}

function parseLiteral(input, pos) {
	let value = '';
	let isLast = 0;

	while (!isLast) {
		isLast = input.substr(pos++, 1) === '0';
		value += input.substr(pos, 4);
		pos += 4;
	}

	return [pos, parseInt(value, 2)];
}

function executeOperation(op, input, pos) {
	const lengthType = input.substr(pos++, 1);
	const arguments = [];

	let argument;

	if (lengthType === '0') {
		let length;

		[pos, length] = parseBinary(input, pos, 15);

		const endPos = pos + length;

		while(pos < endPos) {
			[pos, argument] = handlePacket(input, pos);
			arguments.push(argument);
		}
	} else {
		let count;

		[pos, count] = parseBinary(input, pos, 11);

		for (let i = 0; i < count; i++) {
			[pos, argument] = handlePacket(input, pos);
			arguments.push(argument);
		}
	}

	let value;

	switch (op) {
		case 0: // sum
			value = arguments.reduce((n, sum) => sum += n);
			break;
		case 1: // product
			value = arguments.reduce((n, sum) => sum *= n);
			break;
		case 2: // minimum
			value = Math.min(...arguments);
			break;
		case 3: // maximum
			value = Math.max(...arguments);
			break;
		case 5: // greater than
			value = arguments[0] > arguments[1] ? 1 : 0;
			break;
		case 6: // less than
			value = arguments[0] < arguments[1] ? 1 : 0;
			break;
		case 7: // equal to
			value = arguments[0] === arguments[1] ? 1 : 0;
			break;
	}

	return [pos, value];
}

function handlePacket(input, pos = 0) {
	let version, type, value;

	[pos, version] = parseBinary(input, pos, 3);
	[pos, type] = parseBinary(input, pos, 3);

	versionsSum += version;

	if (type === 4) {
		return parseLiteral(input, pos)
	} else {
		return executeOperation(type, input, pos);
	}
}

function main() {
	const input = fs.readFileSync('./input.txt')
		.toString()
		.split('')
		.map(n => parseInt(n, 16))
		.map(n => n.toString(2))
		.map(n => '0000'.substr(n.length) + n)
		.join('');

	const [_, result] = handlePacket(input);

	console.log('versions sum:', versionsSum);
	console.log('result:', result);
}

main();

