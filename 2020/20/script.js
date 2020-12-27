const fs = require('fs');

const tiles = {};

function getTileById(id) {
	return copyTile(tiles[id].body);
}

function getBorders(tile) {
	const borders = [];

	for (const line of tile) {
		if (!borders[0]) {
			borders[0] = line; // top border
			borders[1] = []; // right border
			borders[3] = []; // left border
		}

		borders[1].push(line[line.length - 1]);
		borders[2] = line; // bottom border
		borders[3].push(line[0]);
	}

	return borders;
}

function getPossibleBorders(tile) {
	const borders = getBorders(tile);
	
	return [
		...borders.map(b => b.join('')),
		...borders.slice().map(b => b.slice().reverse().join('')),
	];
}

function getBorder(tile, borderId) {
	return getBorders(tile)[borderId].join('');
}

function getMatching(tileId, tileSnapshot, side) {
	const border = getBorder(tileSnapshot, side);
	const matching = [];

	for (let id in tiles) {
		if (id === tileId) {
			continue;
		}

		const borders = getPossibleBorders(getTileById(id));

		if (borders.includes(border)) {
			matching.push(id);
		}
	}

	if (matching.length > 1) {
		throw new Error(`more than once neighbor found with border ${border}`);
	}

	return matching[0];
}

function setAreaValue(area, x, y, val) {
	if (!area[y]) {
		area[y] = [];
	}
	area[y][x] = val;
}

function getAreaValue(area, x, y) {
	if (!area[y]) {
		return;
	}

	return area[y][x];
}

function rotateTileRight90(tile) {
	const newTile = [];

	for (let y = 0; y < tile.length; y++) {
		for (let x = 0; x < tile[y].length; x++) {
			setAreaValue(newTile, tile[y].length - y - 1, x, tile[y][x]);
		}
	}

	return newTile;
}

function rotateUntilBorderMatches(tile, targetTile, targetBorderId) {
	const targetBorder = getBorder(targetTile, targetBorderId);
	const borderId = (targetBorderId + 2) % 4;

	if (getBorder(tile, borderId) === targetBorder) {
		return tile;
	}

	for (let i = 0; i < 3; i++) {
		tile = rotateTileRight90(tile);

		if (getBorder(tile, borderId) === targetBorder) {
			return tile;
		}
	}

	return;
}

function transformUntilMatches(tileId, targetTile, targetBorderId) {
	const srcTile = getTileById(tileId);

	let tile;

	tile = rotateUntilBorderMatches(srcTile, targetTile, targetBorderId);

	if (tile) {
		return tile;
	}

	tile = flipX(srcTile);
	tile = rotateUntilBorderMatches(tile, targetTile, targetBorderId);

	if (tile) {
		return tile;
	}

	tile = flipY(srcTile);
	tile = rotateUntilBorderMatches(tile, targetTile, targetBorderId);

	return tile;
}

function copyTile(srcTile) {
	const tile = [];

	for(const y in srcTile) {
		tile[y] = srcTile[y].slice();
	}

	return tile;
}

function flipX(tile) {
	return copyTile(tile).reverse();
}

function flipY(tile) {
	return copyTile(tile).map(y => y.reverse());
}

function printTile(tile) {
	for (const line of tile) {
		console.log(line.join(''));
	}
	console.log();
}

function getNeighborPostition(x, y, side) {
	let [xx, yy] = [x, y];

	switch (side) {
		case 0:
			yy--;
			break;
		case 1:
			xx++;
			break;
		case 2:
			yy++;
			break;
		case 3:
			xx--;
			break;
	}

	return [xx, yy];
}

function parseTiles() {
	const lines = fs.readFileSync('./tiles.txt').toString().split('\n');

	let curTile;

	for (const line of lines) {;
		if (!line) {
			continue;
		}

		if (line.startsWith('Tile')) {
			const match = line.match(/(?<tileId>\d+)/);

			if (!match) {
				throw new Error(`failed to parse title: ${line}`);
			}

			curTile = {
				body: [],
			};

			tiles[match.groups.tileId] = curTile;

			continue;
		}

		curTile.body.push(line.split(''));
	}
}

function tranformTiles() {
	const tileIds = Object.keys(tiles);
	const tilesCount = tileIds.length;
	const firsTileId = tileIds[0];
	const firstTile = getTileById(firsTileId);

	const map = [];

	setAreaValue(map, tilesCount, tilesCount, [firstTile, firsTileId]);

	while (true) {
		let tileAdded = false;

		for (const y in map) {
			for (const x in map[y]) {
				for(let side = 0; side < 4; side++) {
					const [xx, yy] = getNeighborPostition(x, y, side);
	
					if (!getAreaValue(map, x, y) || getAreaValue(map, xx, yy)) {
						continue;
					}
	
					const [tile, tileId] = getAreaValue(map, x, y);
					const matchingTileId = getMatching(tileId, tile, side);
	
					if (!matchingTileId) {
						continue;
					}
	
					const matchingTile = transformUntilMatches(matchingTileId, tile, side);

					setAreaValue(map, xx, yy, [matchingTile, matchingTileId]);
	
					tileAdded = true;
				}
	
			}
		}

		if (!tileAdded) {
			break;	
		}	
	}

	return map;
}

function makeImage(map) {
	let image = [];

	let [x0, y0] = [0, 0];
	let tileSizeX, tileSizeY;

	for (const Y in map) {
		for (const X in map[Y]) {
			const[tile] = map[Y][X];

			tileSizeY = tile.length - 2;
			tileSizeX = tile[0].length - 2;

			for (let ty = 1; ty < tile.length - 1; ty++) {
				for (let tx = 1; tx < tile[ty].length - 1; tx++) {
					setAreaValue(image, x0 + tx - 1, y0 + ty - 1, tile[ty][tx]);
				}
			}

			x0 += tileSizeX;
		}

		x0 = 0;
		y0 += tileSizeY;
	}

	return image;
}

function markMonsters(image) {
	const monsterPixels = [
		[18, 0],
		[0, 1], [5, 1], [6, 1], [11, 1], [12, 1], [17, 1], [18, 1], [19, 1],
		[1 ,2], [4, 2], [7, 2], [10, 2], [13, 2], [16, 2]
	];

	let count  = 0;

	for (let y = 0; y < image.length; y++) {
		xloop:
		for (let x = 0; x < image[y].length; x++) {		
			for (let [xx, yy] of monsterPixels) {
				if (getAreaValue(image, x + xx, y + yy) !== '#') {
					continue xloop;
				}
			}

			count++;

			for (let [xx, yy] of monsterPixels) {
				setAreaValue(image, x + xx, y + yy, 'O');
			}
		}
	}

	return count;
}

function main() {
	parseTiles();

	const map = tranformTiles();
	
	let image = makeImage(map);
	
	image = rotateTileRight90(image);

	const monstersCount = markMonsters(image);

	printTile(image);

	console.log(monstersCount);

	let partsCount = 0;

	for (const line of image) {
		for (const pixel of line) {
			if (pixel === '#') {
				partsCount++;
			}
		}
	}

	console.log(partsCount);
}

main();