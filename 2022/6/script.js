const fs = require('fs');

function main() {
	const buffer = fs.readFileSync('./buffer.txt')
		.toString();


	// const sequenceSize = 4 // part 1;
	const sequenceSize = 14;
	const sequence = [];

	for (let i = 0; i < buffer.length; i++) {
		sequence.push(buffer[i]);

		if (sequence.length > sequenceSize) {
			sequence.shift();
		}

		if (new Set(sequence).size === sequenceSize) {
			console.log(i + 1);
			break;
		}
	}
}

main();