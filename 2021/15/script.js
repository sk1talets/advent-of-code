const fs = require('fs');
const PriorityQueue = require('priorityqueuejs');

function parsePos(pos) {
	return pos.split(',').map(n => parseInt(n, 10));
}

function getSize(map, repeat = 1) {
	return [
		map[0].length * repeat, // X
		map.length * repeat,    // Y
	];
}

function getAdjacent(map, repeat, pos) {
	const [X, Y] = getSize(map, repeat);
	const [x, y] = parsePos(pos);

	return [
		[x + 1, y],
		[x, y + 1],
		[x - 1, y],
		[x, y - 1],
	]
	.filter(([x, y]) => x >= 0 && x < X && y >=0 && y < Y)
	.map(xy => xy.join(','));
}

function getCost(map, pos) {
	const [X, Y] = getSize(map);
	const [x, y] = parsePos(pos);
	const cost = map[y % Y][x % X] + Math.floor(y/Y) + Math.floor(x/X);

	return cost % 10 + Math.floor(cost/10); // 10 -> 1
}

function main() {
	const map = fs.readFileSync('./map.txt')
		.toString()
		.split('\n')
		.map(line => line.split('').map(n => parseInt(n, 10)));

	const repeatMap = 5; // = 1; // Part 1
	const queue = new PriorityQueue((a, b) => b.cost - a.cost);
	const prevPoint = {};
	const costs = { '0,0': 0 };
	const visited = {};

	queue.enq({pos: '0,0', cost: 0});

	while (true) {
		if (queue.isEmpty()) {
			break;
		}

		const cur = queue.deq().pos;

		if (visited[cur]) {
			continue;
		}

		for (const next of getAdjacent(map, repeatMap, cur)) {
			const newCost = costs[cur] + getCost(map, next);
			if (!costs[next] || costs[next] > newCost) {
				queue.enq({cost: newCost, pos: next});
				costs[next] = newCost;
				prevPoint[next] = cur;
			}
		}

		visited[cur] = true;
	}

	const [X, Y] = getSize(map, repeatMap);
	let pos = [X - 1, Y - 1].join(',');

	let totalRisk = 0;

	while (pos != '0,0') {
		totalRisk += getCost(map, pos)
		pos = prevPoint[pos];
	}

	console.log('total risk:', totalRisk);
}

main();

