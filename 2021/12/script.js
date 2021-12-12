const fs = require('fs');

function isSmallCave(cave) {
	return cave.match(/^[a-z]+$/);
}

function findPaths(map, start, end, paths = [], curPath = {}) {
	curPath[start] = curPath[start] + 1 || 1;

	if (isSmallCave(start) && curPath[start] === 2) {
		curPath['small cave visited twice'] = true;
	}

	if (start === end) {
		paths.push(curPath);
		return;
	}

	if (!map[start]) {
		return;
	}

	for (const x of map[start]) {
		if (isSmallCave(x) && x in curPath) {
			// continue; // Part 1

			if (['start', 'end'].includes(x) || curPath['small cave visited twice']) {
				continue;
			}
		}

		findPaths(map, x, end, paths, {...curPath});
	}

	return paths;
}

function main() {
	const map = {};

	fs.readFileSync('./map.txt')
		.toString()
		.split('\n')
		.map(line => {
			const [x, y] = line.split('-');

			map[x] ? map[x].push(y) : map[x] = [y];
			map[y] ? map[y].push(x) : map[y] = [x];
		});

	const paths = findPaths(map, 'start', 'end');

	console.log('paths count:', paths.length);
}

main();

