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

	// coordinates from Part I
	const laserX = 19;
	const laserY = 11;

	const visible = {};

	for (const [x, y] of asteroids) {
		const dx = laserX - x;
		const dy = laserY - y;

		if (!dx && !dy) {
			continue;
		}

		const angle = Math.atan2(dy, dx);

		const info = {x, y, dist: dx ** 2 + dy ** 2};

		if (angle in visible) {
			visible[angle].push(info);
		} else {
			visible[angle] = [info];
		}
	}

	for (const angle in visible) {
		visible[angle].sort((a, b) => a.dist - b.dist);
	}

	const anglesSorted = Object.keys(visible).sort((a, b) => a - b);

	let count = 0;

	main:
	while (true) {
		for (const angle of anglesSorted) {
			if (!count && angle < Math.PI/2) {
				continue;
			}

			const info = visible[angle].shift();
		
			if (info) {
				console.log(++count, angle, info);
			}

			if (count === 200) {
				console.log(count, info.x * 100 + info.y);
				break main;
			}	
		}
	}
}

main();