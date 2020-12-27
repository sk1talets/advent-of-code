const fs = require('fs');
const { exit } = require('process');

function main() {
	const lines = fs.readFileSync('./passwords.txt').toString().split('\n');

	let okCount = 0;

	for (const line of lines) {
		const match = line.match(/^(\d+)-(\d+)\s+(\w):\s+(.+)$/);

		if (!match) {
			console.log(line, 'did not match');
			exit(1);
		}

		let first = parseInt(match[1], 10);
		let second = parseInt(match[2], 10);
		
		let letter = match[3];
		let password = match[4];

		let count = 0;

		if (password[first-1] === letter) {
			count++;
		}

		if (password[second-1] === letter) {
			count++;
		}

		if (count === 1) {
			console.log('ok', line);
			okCount++;
		}
	}

	console.log('total OK', okCount);
}

main();