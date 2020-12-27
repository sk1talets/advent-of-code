const fs = require('fs');

function main() {
	const lines = fs.readFileSync('./ingredients.txt').toString().split('\n');
	const allergens = {};
	const count = {};

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

		for (const ingredient of ingredientsList) {
			if (ingredient in count) {
				count[ingredient]++;
			} else {
				count[ingredient] = 1;
			}
		}
	}

	for (const {in: includes } of Object.values(allergens)) {
		for (const ingredient of includes) {
			count[ingredient] = 0;
		}
	}

	let result = 0;

	for (const n of Object.values(count)) {
		result += n;
	}

	console.log(result);
}

main();