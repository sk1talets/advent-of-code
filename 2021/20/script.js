const fs = require('fs');

function getPixel(image, x, y, voidPixel = '.') {
	return image[y]?.[x] ?? voidPixel;
}

function setPixel(image, x, y, value) {
	image[y] ? null : image[y] = [];
	image[y][x] = value;
}

function getIndex(image, x, y, voidPixel) {
	let number = '';

	for (let yy = y - 1; yy <= y + 1; yy++) {
		for (let xx = x - 1; xx <= x + 1; xx++) {
			number += getPixel(image, xx, yy, voidPixel) === '#' ? '1' : '0';
		}
	}

	return parseInt(number, 2);
}

function getOutputPixel(algorithm, index) {
	return algorithm[index];
}

function countPixels(image, type) {
	let count = 0;

	image.forEach(row => row.forEach(
		pixel => pixel === type ? count++ : null
	));

	return count;
}

function applyAlgorithm(image, algorithm, N = 1) {
	let newImage;

	for (let i = 0; i < N; i++) {
		voidPixel = i % 2 ? algorithm[0] : '.';

		[oldImage, newImage] = [newImage ?? image, []];

		for (let y = -1; y < oldImage.length + 1; y++) {
			for (let x = -1; x < oldImage[0].length + 1; x++) {
				const pixelIndex = getIndex(oldImage, x, y, voidPixel);
				const pixel = getOutputPixel(algorithm, pixelIndex);

				setPixel(newImage, x + 1, y + 1, pixel)
			}
		}

		newImage.forEach(line => console.log(line.join('')));
	}

	return newImage;
}

function main() {
	const lines = fs.readFileSync('./input.txt').toString().split('\n');
	const algorithm = lines.shift().split('');

	lines.shift(); // empty line

	let image = lines.map(line => line.split(''));

	const applyTimes = 50; // 2; Part 1

	image = applyAlgorithm(image, algorithm, applyTimes);

	console.log('light pixels:', countPixels(image, '#'));
}

main();