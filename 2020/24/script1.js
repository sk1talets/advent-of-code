const fs = require('fs');

function parseRoute(route) {
	const directions = [];
	let prevToken = '';

	for (const token of route.split('')) {
		switch (token) {
			case 'e':
			case 'w':
				directions.push(prevToken + token);
				prevToken = '';
				break;
			case 'n':
			case 's':
				prevToken = token;
				break;
		}
	}

	return directions;
}

function getCoordinates(route) {
	const directions = parseRoute(route);
	
	let x = 0;
	let y = 0;

	for (const dir of directions) {
		switch (dir) {
			case 'ne':
				x++;
				y++;
				break; 
			case 'e':
				x += 2;
				break; 
			case 'se':
				x++;
				y--;
				break; 
			case 'sw':
				x--;
				y--;
				break;
			case 'w':
				x -= 2;
				break; 
			case 'nw':
				x--;
				y++;
				break;
			default:
				throw new Error(`unknown direction: ${dir}`);
		}
	}

	return `${x} ${y}`;
}

function main() {
	const routes = fs.readFileSync('./routes.txt').toString().split('\n');
	const colors = {};

	for (const route of routes) {
		const xy = getCoordinates(route);

		if (xy in colors) {
			colors[xy] = colors[xy] === 'w' ? 'b' : 'w';
		} else {
			colors[xy] = 'b';
		}
	}

	const blackCount = Object.values(colors).filter(c => c === 'b').length;

	console.log(blackCount);
}

main();