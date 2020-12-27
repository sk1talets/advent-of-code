const fs = require('fs');

function main() {
	const notes = fs.readFileSync('./notes.txt').toString().split('\n');

	const arrivalTime = parseInt(notes[0]);
	const busses = notes[1].split(',').map(id => id === 'x' ? 'x' : parseInt(id));

	let minWaitingTime;
	let bestBusId;

	for (const id of busses) {
		if (id === 'x') {
			continue;
		}

		let waitingTime = id - arrivalTime % id;

		if (typeof minWaitingTime === 'undefined' || waitingTime < minWaitingTime) {
			minWaitingTime = waitingTime;
			bestBusId = id;
		}
	}

	console.log(minWaitingTime * bestBusId);
}

main();