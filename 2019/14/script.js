const fs = require('fs');

const formulas = {};

function parseProduct(s) {
	const [factor, name] = s.split(/\s+/);

	return [parseInt(factor), name];
}

function parseFormulas(file) {
	const lines = fs.readFileSync(file).toString().split('\n');

	for (const line of lines) {
		const [sourcesList, product] = line.split(' => ');
		const [factor, productName] = parseProduct(product);
		const sources = sourcesList.split(', ').map(s => parseProduct(s));

		formulas[productName] = [factor, sources];
	}
}

function getOreAmountFor(product, amount = 1, storage = {}) {
	const [productFactor, sources] = formulas[product];

	storage[product] = storage[product] || 0;

	if (storage[product] >= amount) {
		storage[product] -= amount;
		return 0;
	} else {
		amount -= storage[product];
		storage[product] = 0;
	}

	// how many times we will need to run the reaction?
	const multiplier = Math.ceil(amount / productFactor);

	if (productFactor * multiplier > amount) {
		storage[product] += productFactor * multiplier - amount;
	}

	let oreRequired = 0;

	for (const [factor, source] of sources) {
		if (source === 'ORE') {
			oreRequired += factor * multiplier;
		} else {
			oreRequired += getOreAmountFor(source, multiplier * factor, storage);
		}
	}

	return oreRequired;
}

function main() {
	parseFormulas('./formulas.txt')

	const oreAmount = 1000000000000;
	const oreForOneFuel = getOreAmountFor('FUEL');
	const estimatedFuel = Math.floor(oreAmount / oreForOneFuel);

	let fuel = estimatedFuel;

	for (let step = 1000000; step >= 1; step = step / 10) {
		for (; getOreAmountFor('FUEL', fuel + step) < oreAmount; fuel += step);
	}

	console.log(fuel);
}

main();
