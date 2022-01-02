const fs = require('fs');

function guessScannerPosition(positions0, positions) {
	const seen = {};

	for (const [x1, y1, z1] of positions0) {
		for (const [x2, y2, z2] of positions) {
			const key = [x1 - x2, y1 - y2, z1 - z2];

			seen[key] = seen[key] + 1 || 1;

			if (seen[key] >= 12) {
				return key;
			}
		}
	}
}

function rebasePositions(positions, base) {
	for (const pos of positions) {
		for (let i = 0; i < 3; i++) {
			pos[i] +=  base[i];
		}
	}
}

function getPermutations(values, result = [], cur = []) {
	if (cur.length === values.length) {
		result.push(cur);
		return;
	}

	for (const value of values) {
		if (!cur.find(([v]) => v === value)) {
			getPermutations(values, result, [...cur, [value, +1]]);
			getPermutations(values, result, [...cur, [value, -1]]);
		}
	}

	return result;
}

function main() {
	const data = fs.readFileSync('./data.txt').toString().split('\n');
	const scanners = [];

	for (const line of data) {
		if (line === '') {
			continue;
		}

		if (line.match('scanner')) {
			scanners.push([]);
			continue;
		}

		scanners[scanners.length - 1].push(line.split(',').map(n => parseInt(n, 10)));
	}

	const scanner0 = scanners.shift();
	const scannersPositions = [];

	scanners: while (scanners.length) {
		const scanner = scanners.shift();

		for (const permutation of getPermutations([0, 1, 2])) {
			const scanner_ = scanner.map(pos => permutation.map(([i, sign]) => pos[i] * sign));
			const position = guessScannerPosition(scanner0, scanner_);

			if (position) {
				scannersPositions.push(position);

				rebasePositions(scanner_, position);

				for (const [x, y, z] of scanner_) {
					if (!scanner0.find(([x0, y0, z0]) => x === x0 && y === y0 && z === z0)) {
						scanner0.push([x, y, z]);
					}
				}

				continue scanners;
			}

		}

		scanners.push(scanner);
	}

	console.log('beacons:', scanner0.length);

	let maxDistance = 0;

	for (const pos1 of scannersPositions) {
		for (const pos2 of scannersPositions) {
			let distance = 0;

			for (let i = 0; i < 3; i++) {
				distance += Math.abs(pos2[i] - pos1[i]);
			}

			if (distance > maxDistance) {
				maxDistance = distance;
			}
		}
	}

	console.log('max distance:', maxDistance);

}

main();