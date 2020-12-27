const fs = require('fs');

const data = {};

function findPath(src, dest, path = 0, prev) {
	for (const neighbor of data[src]) {
		if (neighbor === prev) {
			continue;
		}

		if (neighbor === dest) {
			return [true, path + 1];
		}

		const [found, path_] = findPath(neighbor, dest, path + 1, src);

		if (found) {
			return [found, path_];
		}
	}

	return [0, false];
}

function main() {
	const orbits = fs.readFileSync('./orbits.txt').toString().split('\n').map(s => s.trim(s));

	for (const orbit of orbits) {
		const [primary, satellite] = orbit.split(')');

		if (!data[primary]) {
			data[primary] = [];
		}

		if (!data[satellite]) {
			data[satellite] = [];
		}

		data[primary].push(satellite);
		data[satellite].push(primary);
	}

	const [found, path] = findPath('YOU', 'SAN');

	if (found) {
		console.log(path - 2);
	} else {
		console.log('path not found');
	}
}

main();