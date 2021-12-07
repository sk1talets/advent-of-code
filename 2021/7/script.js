const fs = require('fs');

function main() {
	const positions = fs.readFileSync('./positions.txt')
		.toString()
		.split(',')
		.map(n => parseInt(n, 10));

	let bestPos;
	let minFuel;

	loop:
	for (let pos = 0; pos < positions.length; pos++) {
		let fuel = 0;

		for (let curPos of positions) {
			let diff = Math.abs(pos - curPos);

			// fuel += diff; // part 1
			fuel += (1 + diff) * diff / 2;

			if (minFuel && fuel > minFuel) {
				continue loop;
			}
		}

		if (!minFuel || fuel < minFuel) {
			minFuel = fuel;
			bestPos = pos;	
		}
	}

	console.log('Best position:', bestPos, 'fuel:', minFuel);
}

main();