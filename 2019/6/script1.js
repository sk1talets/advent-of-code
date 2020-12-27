const fs = require('fs');

const sattelites = {};

function getSattlitesCount(body, primaries = 0) {
	let count = 0;

	if (!sattelites[body]) {
		return 0;
	}

	for (const sattelite of sattelites[body]) {
		count += 1 + primaries + getSattlitesCount(sattelite, primaries + 1);
	}

	return count;
}

function main() {
	const orbits = fs.readFileSync('./orbits.txt').toString().split('\n').map(s => s.trim(s));

	for (const orbit of orbits) {
		const [primary, satellite] = orbit.split(')');

		if (!sattelites[primary]) {
			sattelites[primary] = [];
		}

		sattelites[primary].push(satellite);
	}

	console.log(getSattlitesCount('COM'));
}

main();