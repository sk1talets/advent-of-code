const fs = require('fs');

function main() {
	const [x1, x2, y1, y2] = fs.readFileSync('./data.txt')
		.toString()
		.match(/(-{0,1}\d+)/g)
		.map(n => parseInt(n, 10));

	const stepsY = new Map();
	const velocities = new Set();

	let maxHeight = 0;

	for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
		for (let ny = 1;; ny++) { // number of steps
			const vy = y/ny + (ny - 1)/2;

			if (ny > 2 * Math.abs(y)) {
				// vy is not an integer
				break;
			}

			if (Number.isInteger(vy)) {
				const h = vy/2 * (vy + 1);

				if (h > maxHeight) {
					maxHeight = h;
				}

				if (!stepsY.has(ny)) {
					stepsY.set(ny, new Set());
				}

				stepsY.get(ny).add(vy);
			}
		}
	}

	for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
		for (let nx = 1;; nx++) { // number of steps
			const vx = x/nx + (nx - 1)/2;

			if (nx > vx) {
				// vx is 0 in nx steps
				break;
			}

			if (Number.isInteger(vx)) {
				stepsY.forEach((Vy, ny) => {
					if (ny === nx || (vx === nx && ny > nx)) {
						// x steps = y steps or vx = n (then it's 0 in n steps)
						// so that we can make more steps with the same x
						for (const vy of Vy) {
							velocities.add(`${vx},${vy}`);
						}
					}
				});
			}
		}
	}

	console.log('max height:', maxHeight);
	console.log('possible velocities:', velocities.size);
}

main();

