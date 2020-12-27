const fs = require('fs');

function getWirePoints(commands) {
	const pos = {
		x: 0,
		y: 0
	};

	let steps = 0;
	const points = {};

	for (const command of commands) {
		const match = command.match(/^([UDRL])(\d+)$/);

		if (!match) {
			throw new Error(`failed to parse ${command}`);
		}

		const direction = match[1];
		const num = parseInt(match[2]);

		const step = ['U', 'R'].includes(direction) ? 1 : -1;
		const coordnate = ['R', 'L'].includes(direction) ? 'x' : 'y';

		for (let i = 0; i < num; i++) {
			pos[coordnate] += step;

			const curPos = `${pos.x},${pos.y}`;

			if (points[curPos]) {
				points[curPos].push(++steps);
			} else {
				points[curPos] = [++steps];
			}
		}
	}

	return points;
}

function findIntersections(points1, points2) {
	const res = [];

	for (const point in points1) {
		if (points2[point]) {
			res.push(point);
		}		
	}

	return res;
}


function main() {
	const commands = fs.readFileSync('./paths.txt').toString().split('\n').map(s => s.trim().split(','));

	const points1 = getWirePoints(commands[0]);
	const points2 = getWirePoints(commands[1]);

	for (const int of findIntersections(points1, points2)) {
		console.log(int, points1[int][0] + points2[int][0]);
	}
}

main();