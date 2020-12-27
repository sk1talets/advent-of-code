const fs = require('fs');

function main() {
	const lines = fs.readFileSync('./ingredients.txt').toString().split('\n');
	const allergens = {};

	for (const line of lines) {
		const match = line.match(/^(?<ingredients>.+?) \(contains (?<allergens>.+?)\)/);

		if (!match) {
			throw new Error('failed to parse input');
		}

		const ingredientsList = match.groups.ingredients.split(/\s+/);
		const allergensList = match.groups.allergens.split(/,\s+/);

		for (const allergen of allergensList) {
			if (allergen in allergens) {
				const newIn = [];

				for (const igredient of ingredientsList) {
					if (allergens[allergen].in.includes(igredient)) {
						newIn.push(igredient);
					} else {
						allergens[allergen].notIn.push(igredient);
					}
				}

				for (const oldIn of allergens[allergen].in) {
					if (!newIn.includes(oldIn)) {
						allergens[allergen].notIn.push(oldIn);
					}
				}

				allergens[allergen].in = newIn;
			} else {
				allergens[allergen] = {
					in: ingredientsList,
					notIn: [],
				};
			}
		}
	}

	const allergensMap = {};

	while (true) {
		let cleanupDone = false;

		for (const i in allergens) {
			if (allergens[i].in.length === 1) {
				const ingredient = allergens[i].in[0];

				allergensMap[ingredient] = i;

				for (const j in allergens) {
					if (i === j || !allergens[j].in.includes(ingredient)) {
						continue;
					}

					allergens[j].in = allergens[j].in.filter(e => e !== ingredient);

					cleanupDone = true;
				}
			} 
		}

		if (!cleanupDone) {
			break;
		}
	}

	const result = Object.keys(allergensMap).sort((a, b) => allergensMap[a].localeCompare(allergensMap[b])).join();

	console.log(result);
}

main();