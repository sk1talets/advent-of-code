const fs = require('fs');

function main() {
	const lines = fs.readFileSync('./map.txt').toString().split('\n');

	const map = [];

	for (const line of lines) {
		map.push(line.split(''));
	}

	let N = 0;
	let x = 0;

	for (let y = 0; y < map.length; y += 1) {
		const isTree = map[y][x] === '#';

		N += isTree ? 1 : 0;
		map[y][x] = isTree ? 'X' : 'O';

		x += 3;

		if (x >= map[y].length) {
			x -= map[y].length;
		}
	}

	for (const line of map) {
		console.log(line.join(''));
	}

	console.log(N);
}

main();