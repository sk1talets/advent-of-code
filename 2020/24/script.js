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
				y++;
				x++;
				break; 
			case 'e':
				x += 2;
				break; 
			case 'se':
				x++;
				y--;
				break; 
			case 'sw':
				y--;
				x--;
				break;
			case 'w':
				x -= 2;
				break; 
			case 'nw':
				y++;
				x--;
				break;
			default:
				throw new Error(`unknown direction: ${dir}`);
		}
	}

	return [x, y];
}

function getColor(x, y, tiles) {
	const xy = `${x} ${y}`;

	return xy in tiles ? tiles[xy].color : 'w';
}

function isTilePosition(x, y) {
	return Math.abs(y) % 2 === Math.abs(x) % 2
}

function getTile(x, y, tiles) {
	const xy = `${x} ${y}`;

	if (!tiles[xy]) {
		tiles[xy] = {x, y, color: 'w'}
	}

	return tiles[xy];
}

function flipTile(x, y, tiles) {
	const tile = getTile(x, y, tiles);

	tile.color = tile.color === 'w' ? 'b' : 'w';
}

function getAdjacent(x, y) {
	return [
		[x + 1, y + 1],
		[x + 2, y],
		[x + 1, y - 1],
		[x - 1, y - 1],
		[x - 2, y],
		[x - 1, y + 1],
	];
}

function getAdjacentBlack(x, y, tiles) {
	let count = 0;

	for (const [xx, yy] of getAdjacent(x, y)) {
		count += getColor(xx, yy, tiles) === 'b';
	}

	return count;
}


function setTiles(routes, tiles) {
	for (const route of routes) {
		const [x, y] = getCoordinates(route);

		flipTile(x, y, tiles);
	}
}


function copyTiles(tiles) {
	const newTiles = {};

	for (const id in tiles) {
		newTiles[id] = {...tiles[id]}
	}

	return newTiles;
}

function getTilesCount(color, tiles) {
	return Object.values(tiles).filter(t => t.color === color).length;
}

function main() {
	const routes = fs.readFileSync('./routes.txt').toString().split('\n');

	let tiles = {};

	setTiles(routes, tiles);

	console.log(`Day 0:`, getTilesCount('b', tiles));

	const Xs = [];
	const Ys = [];

	for (tile of Object.values(tiles)) {
		Xs.push(tile.x);
		Ys.push(tile.y);
	}

	let [minY, maxY] = [Math.min(...Ys) - 2, Math.max(...Ys) + 2];
	let [minX, maxX] = [Math.min(...Xs) - 2, Math.max(...Xs) + 2];

	for (let day = 1; day <= 100; day++) {
		let newTiles = copyTiles(tiles);

		// increase area
		minX -= 1; maxX += 1;
		minY -= 1; maxY += 1;

		const adjacent = getAdjacent(0, 0);

		for (let y = minY; y <= maxY; y++) {
			for (let x = minX; x <= maxX; x++) {

				if (!isTilePosition(x, y)) {
					continue;
				}

				const tile = getTile(x, y, tiles);
				const adjacentBlack = getAdjacentBlack(x, y, tiles);
	
				if (tile.color === 'b') {
					if (adjacentBlack === 0 || adjacentBlack > 2) {
						flipTile(x, y, newTiles);
					}
				} else if (tile.color === 'w') {
					if(adjacentBlack === 2) {
						flipTile(x, y, newTiles);
					}
				}
			}
		}
	
		console.log(`Day ${day}:`, getTilesCount('b', newTiles));

		tiles = newTiles;
	}
}

main();