const fs = require('fs');

const MAX_HEIGHT = 9;

function getHeight(map, x, y) {
	return map[y][x];
}

function getAdjacent(map, x, y) {
	return [
		[x, y - 1],
		[x + 1, y],
		[x, y + 1],
		[x - 1, y],
	].filter(([x, y]) => y in map && x in map[y]);
}

function scanBasin(map, x, y, low = null, points = []) {
	const height = getHeight(map, x, y);

	if (low === null) {
		low = height;
	}

	points.push([x,y].join());

	for (const [xx, yy] of getAdjacent(map, x, y)) {
		if (points.includes([xx,yy].join())) {
			continue;
		}

		const adjacentHeight = getHeight(map, xx, yy);

		if (adjacentHeight >= MAX_HEIGHT) {
			continue;
		}

		if (adjacentHeight < low) {
			return false;
		}

		if (!scanBasin(map, xx, yy, low, points)) {
			return false;
		}
	}

	return points;
}

function main() {
	const map = fs.readFileSync('./map.txt')
		.toString()
		.split('\n')
		.map(line => line.split('').map(n => parseInt(n, 10)));

	const sizes = [];

	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			const points = scanBasin(map, x, y);

			if (points) {
				sizes.push(points.length);
			}
		}
	}

	const result = sizes
		.sort((a, b) => b - a)
		.slice(0,3)
		.reduce((n, res) => res *= n);

	console.log(result);
}

main();

