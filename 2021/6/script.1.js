const fs = require('fs');

function main() {
	let ages = fs.readFileSync('./ages.txt')
		.toString()
		.split(',')
		.map(num => parseInt(num, 10));

	const totalDays = 256;
	const cache = {};

	countSpawns = (day, age) => {
		const key = [day, age].join();
		
		if (cache[key]) {
			return cache[key];
		}

		let count = 1;

		for (let n = 0;; n++) {
			let spawnDay = 2 + (day + age - 8) + 7 * (n + 1);

			if (spawnDay > totalDays) {
				break;
			}

			count += countSpawns(spawnDay, 8);
		}

		return cache[key] = count;
	}

	let total = 0;

	for (const age of ages) {
		total += countSpawns(0, age);
	}

	console.log('total:', total);
}

main();