const fs = require('fs');

function getAdjacent(map, x, y) {
	return [
		[x,     y - 1],
		[x,     y + 1],
		[x - 1,     y],
		[x - 1, y - 1],
		[x - 1, y + 1],
		[x + 1, y - 1],
		[x + 1,     y],
		[x + 1, y + 1],
	].filter(([x, y]) => y in map && x in map[y]);
}

function checkFlashes(map, x, y) {
	if (map[y][x] !== 10) {
		return 0;
	}

	let count = 1;

	for (const [xx, yy] of getAdjacent(map, x, y)) {
		if (map[yy][xx] <= 9) {
			map[yy][xx]++;
			count += checkFlashes(map, xx, yy);
		}
	}

	map[y][x] = 11; // handled

	return count;
}

function traverse(map, callback) {
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			callback(x, y);
		}
	}
}

function main() {
	const map = fs.readFileSync('./map.txt')
		.toString()
		.split('\n')
		.map(line => line.split('').map(n => parseInt(n, 10)));

	let count = 0;

	for (let step = 0; step < 100; step++) {
		traverse(map, (x, y) => map[y][x]++);
		traverse(map, (x, y) => { count += checkFlashes(map, x, y); });
		traverse(map, (x, y) => { map[y][x] > 9 ? map[y][x] = 0 : null; });
	}

	console.log('flushes:', count);
}

main();

