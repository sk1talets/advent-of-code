const fs = require('fs');

function main() {
	const vents = fs.readFileSync('./vents.txt')
		.toString()
		.split('\n')
		.map(line => line.split(/[^\d]+/).map(num => parseInt(num, 10)))

	const map = [];

	setPoint = (x, y) => {
		map[y] = map[y] || [];
		map[y][x] = map[y][x] || 0;
		return ++map[y][x];
	}

	let overlaps = 0;

	for (const [x1, y1, x2, y2] of vents) {
		// part 1
		// if (x1 != x2 && y1 != y2) {
		// 	continue;
		// }

		let [x, y] = [x1, y1];

		while (true) {
			if (setPoint(x, y) === 2) {
				overlaps++;
			}

			if (x === x2 && y === y2) {
				break;
			}

			if (x2 > x1) {
				x++;
			} else if (x2 < x1) {
				x--;
			}

			if (y2 > y1) {
				y++;
			} else if (y2 < y1) {
				y--;
			}
		}
	}

	console.log('result:', overlaps);
}

main();