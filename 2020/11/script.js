const fs = require('fs');

function getAdjacent(seats, y, x) {
	const delta = [-1, 0, +1];
	const res = {'.': 0, 'L': 0, '#': 0};

	for (let dy of delta) {
		for (let dx of delta) {
			if (!dx && !dy) {
				continue;
			}

			const [yy, xx] = [y + dy, x + dx];

			if (yy in seats && xx in seats[yy]) {
				res[seats[yy][xx]]++;
			}
		}
	}

	return res;
}

function getVisible(seats, y, x) {
	const delta = [-1, 0, +1];
	const res = {'.': 0, 'L': 0, '#': 0};

	for (let dy of delta) {
		for (let dx of delta) {
			if (!dx && !dy) {
				continue;
			}

			let dist = 1;

			while (dist < seats.length + seats[0].length) {
				const [yy, xx] = [y + dist * dy, x + dist * dx];

				if (yy in seats && xx in seats[yy]) {

					if (seats[yy][xx] !== '.') {
						res[seats[yy][xx]]++;
						break;
					}
				}

				dist++;
			}
		}
	}

	return res;
}

function main() {
	const lines = fs.readFileSync('./map.txt').toString().split('\n');

	let seats = [];

	for (const line of lines) {
		seats.push(line.split(''));
	}

	let seatsChanged;
	let round = 0;

	while (true) {
		round++;
		seatsChanged = 0;
		const seatsNew = [];

		for (let y = 0; y < seats.length; y++) {
			seatsNew[y] = [...seats[y]];

			for (let x = 0; x < seats[y].length; x++) {
				const adjacent = getVisible(seats, y, x);

				switch (seats[y][x]) {
					case '.':
						continue;
					case '#':
						if (adjacent['#'] >= 5) {
							seatsNew[y][x] = 'L';
							seatsChanged++;
						}
						break;
					case 'L': 
						if (!adjacent['#']) {
							seatsNew[y][x] = '#';
							seatsChanged++;
						} 
						break;
				}
			}
		}

		seats = seatsNew;

		if (!seatsChanged) {
			break;
		}
	}


	let occupied = 0;

	for (let y = 0; y < seats.length; y++) {
		for (let x = 0; x < seats[y].length; x++) {
			if (seats[y][x] === '#') {
				occupied++;
			};
		}
	}

	console.log(occupied);
}

main();