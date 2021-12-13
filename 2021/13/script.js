const fs = require('fs');

function main() {
	const manual = fs.readFileSync('./manual.txt').toString().split('\n');
	const dots = [];
	const folding = [];

	let maxX = 0;
	let maxY = 0;

	const getDot = (x, y) => {
		return y in dots ? !!dots[y][x] : false;
	}

	const setDot = (x, y, value = true) => {
		y in dots ? null : dots[y] = [];
		dots[y][x] = value;
	};

	const unsetDot = (x, y) => {
		setDot(x, y, false);
	}

	let dotsSection = true;

	for (const line of manual) {
		if (line === '') {
			dotsSection = false;
			continue;
		}

		if (dotsSection) {
			const [x, y] = line.split(',').map(n => parseInt(n, 10));

			maxX < x ? maxX = x : null;
			maxY < y ? maxY = y : null;

			setDot(x, y);
		} else {
			const [_, axis, pos] = line.match(/fold along ([xy])=(\d+)/);

			folding.push([axis, parseInt(pos, 10)]);
		}
	}

	for (const [axis, pos] of folding) {
		if (axis === 'x') {
			for (let x = pos + 1; x <= 2*pos; x++) {
				for (let y = 0; y <= maxY; y++) {
					setDot(2*pos - x, y, getDot(x, y) || getDot(2*pos - x, y));
					unsetDot(x, y);
				}
			}
			maxX = maxX/2;
		} else {
			for (let y = pos + 1; y <= 2*pos; y++) {
				for (let x = 0; x <= maxX; x++) {
					setDot(x, 2*pos - y, getDot(x, y) || getDot(x, 2*pos - y));
					unsetDot(x, y);
				}
			}
			maxY = maxY/2;
		}

		//break; // Part 1
	}

	let dotsCount = 0;

	for (let y = 0; y <= maxY; y++) {
		for (let x = 0; x <= maxX; x++) {
			dotsCount += getDot(x, y);
			process.stdout.write(getDot(x, y) ? '#' : ' ');
		}
		process.stdout.write('\n');
	}

	console.log(dotsCount);
}

main();

