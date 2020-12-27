const fs = require('fs');

function main() {
	const lines = fs.readFileSync('./map.txt').toString().split('\n');

	let map = [];

	for (const line of lines) {
		map.push(line.trim().split(''));
	}

	const asteroids = [];

	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[0].length; x++) {
			if (map[y][x] === '#') {
				asteroids.push([x, y]);
			}
		}
	}

	let maxVisible = 0;
	let bestCoodrinates;

	for (const ai of asteroids) {
		const visible = {};

		for (const aj of asteroids) {
			const dx = ai[0] - aj[0];
			const dy = ai[1] - aj[1];

			if (!dx && !dy) {
				continue;
			}

			const angle = Math.atan2(dy, dx);

			if (angle in visible) {
				visible[angle]++;
			} else {
				visible[angle] = 1;
			}
		}

		const count = Object.keys(visible).length;

		if (count > maxVisible) {
			maxVisible = count;
			bestCoodrinates = ai;
		}
	}

	console.log(bestCoodrinates, maxVisible);
}

main();