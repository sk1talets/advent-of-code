const fs = require('fs');

function turnRight90(dx, dy) {
	return [dy, -dx]
}

function turnRight(dx, dy, degrees) {
	for (let i = 0; i < degrees/90; i++) {
		[dx, dy] = turnRight90(dx, dy);
	}

	return [dx, dy];
}

function turnLeft(dx, dy, degrees) {
	return turnRight(dx, dy, 360 - degrees);
}

function main() {
	const moves = fs.readFileSync('./moves.txt')
		.toString().split('\n').map(s => [s[0], parseInt(s.substr(1), 10)]);

	let x = 0, y = 0;
	let dx = 10; dy = 1;

	for (let [direction, distance] of moves) {
		switch(direction) {
			case 'L':
				[dx, dy] = turnLeft(dx, dy, distance);
				break;
			case 'R':
				[dx, dy] = turnRight(dx, dy, distance);
				break;
			case 'N':
				dy += distance;
				break;
			case 'S':
				dy -= distance;
				break;
			case 'E':
				dx += distance;
				break;
			case 'W':
				dx -= distance;
				break;
			case 'F':
				x += dx * distance;
				y += dy * distance;
		}
	}

	console.log(Math.abs(x) + Math.abs(y));
}

main();