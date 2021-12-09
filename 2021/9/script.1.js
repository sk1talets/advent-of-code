const fs = require('fs');

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

function main() {
	const map = fs.readFileSync('./map.txt')
		.toString()
		.split('\n')
		.map(line => line.split('').map(n => parseInt(n, 10)));

	let result = 0;

	for (let y = 0; y < map.length; y++) {
		X: for (let x = 0; x < map[y].length; x++) {
			let height = getHeight(map, x, y);

			for (const [xx, yy] of getAdjacent(map, x, y)) {
				if (getHeight(map, xx, yy) <= height) {
					continue X;
				}
			}

			result += 1 + height;
		}
	}

	console.log(result);
}

main();

