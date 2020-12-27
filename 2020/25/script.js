const fs = require('fs');

function transform(subjectNumber, loopSize) {
	let value = 1;

	for (let i = 0; i < loopSize; i++) {
		value = value * subjectNumber;
		value = value % 20201227;
	}

	return value;
}

function guessLoopSize(subjectNumber, expResult) {
	let value = 1;

	for (let i = 1;; i++) {
		value *= subjectNumber;
		value %= 20201227;

		if (value === expResult) {
			return i;
		}
	}
}

function main() {
	const keys = fs.readFileSync('./keys.txt').toString().split('\n').map(n => parseInt(n));

	const loopSizes = keys.map(key => guessLoopSize(7, key));

	console.log(transform(keys[0], loopSizes[1]));
	console.log(transform(keys[1], loopSizes[0]));
}

main();