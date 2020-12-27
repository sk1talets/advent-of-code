const fs = require('fs');

function main() {
	const notes = fs.readFileSync('./notes.txt').toString().split('\n');
	const schedule = notes[1].split(',').map(id => id === 'x' ? 0 : parseInt(id));

	let step = 1;
	let satisfied = 0;

	times:
	for (let t = 0;; t += step) {
		for (let i = 0; i < schedule.length; i++) {
			const period = schedule[i];

			if (!period) {
				continue;
			}

			if (t < period || (t + i) % period !== 0) {
				continue times;
			}

			if (i > satisfied) {
				step *= period;
				satisfied = i;
			}
		}

		console.log(t);
		break;
	}
}

main();