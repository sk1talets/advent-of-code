const fs = require('fs');

function main() {
	const pixels = fs.readFileSync('./image.txt').toString().split('').map(i => parseInt(i));

	const width = 25;
	const height = 6;
	const layerSize = 25 * 6;

	const stats = {};

	let pos = 0;

	for (let layer = 0; pos < pixels.length - 1; layer++) {
		stats[layer] = {0:0, 1:0, 2:0};
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				pos = layerSize * layer + width * y + x;
				stats[layer][pixels[pos]]++;
			}
		}	
	}

	let minZiroes = layerSize;
	let minZiroesLayer;

	for (layer in stats) {
		if (stats[layer]['0'] < minZiroes) {
			minZiroes = stats[layer]['0'];
			minZiroesLayer = layer;
		}
	}

	console.log('layer:', minZiroesLayer, 'zeroes:', minZiroes);
	console.log(stats[minZiroesLayer]['1'] * stats[minZiroesLayer]['2']);

	const image = [];

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const imgPos = width * y + x;

			image[imgPos] = 2;

			for (let l = 0; l < 100; l++) {
				const pixelsPos = imgPos + layerSize * l;

				if (pixels[pixelsPos] < 2) {
					image[imgPos] = pixels[pixelsPos];
					break;
				}
			}
		}
	}

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			process.stdout.write(image[width * y + x] === 1 ? '█' : ' ');
		}
		process.stdout.write('\n')
	}

}

main();