const fs = require('fs');

function main() {
	const initial = fs.readFileSync('./numbers.txt').toString().split(',').map(n => parseInt(n));

	const numbers = {};

	for (let i = 0; i < initial.length; i++) {
		numbers[initial[i]] = i + 1;
	}

	let num = 0;

	for (let i = initial.length + 1; i < 2020; i++) {
		const prevPos = numbers[num];

		numbers[num] = i;

		if (prevPos) {
			num = i - prevPos;
		} else {
			num = 0;
		}
	}

	console.log(num);
}

main();