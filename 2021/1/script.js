const fs = require('fs');

function main() {
	const depths = fs.readFileSync('./measurements.txt')
		.toString()
		.split('\n')
		.map(n => parseInt(n, 10));

	let count = 0;

	for (let i = 0; i < depths.length; i++) {
		if (i > 0 && depths[i] > depths[i-1]) {
			count++
		}
	}

	console.log(count); // 1st answer

	count = 0;

	for (let i = 0; i < depths.length; i++) {
		if (i < 3) {
			continue;
		}

		count += depths[i] + depths[i-1] + depths[i-2] > depths[i-1] + depths[i-2] + depths[i-3];
	}

	console.log(count); // 2nd answer
}

main();