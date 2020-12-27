const fs = require('fs');

let total = 0;

function getFuelForMass(mass) {
	fuel = Math.floor(mass/3) - 2;

	if (fuel <= 0) {
		return 0;
	}

	fuel += getFuelForMass(fuel);

	return fuel;
}

function main() {
	const masses = fs.readFileSync('./masses.txt').toString().split('\n').map(s => parseInt(s, 10));

	for (const mass of masses) {
		total += getFuelForMass(mass);
	}

	console.log(total);
}

main();