const fs = require('fs');

let count = 0;
let answers = {};
let groupSize = 0;

function main() {
	const lines = fs.readFileSync('./answers.txt').toString().split('\n').map(s => s.trim());

	lines.push('');

	for (const line of lines) {
		if (!line) {
			for (const question in answers) {
				if (answers[question] === groupSize) {
					count++;
				}
			}

			answers = {};
			groupSize = 0;

			continue;
		}
	

		for (const question of line.split('')) {
			if (question in answers) {
				answers[question]++;
			} else {
				answers[question] = 1; 
			}
		}

		groupSize++;
	}

	console.log(count);
}

main();