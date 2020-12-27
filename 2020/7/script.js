const fs = require('fs');

const data = {};

function getBagsCount(bag) {
	let count = 1;

	for (const inBag in data[bag]) {
		count += getBagsCount(inBag) * data[bag][inBag];
	}

	return count;
}

function main() {
	const rules = fs.readFileSync('./rules.txt').toString().split('\n').map(s => s.trim());

	for (const rule of rules) {
		const match = rule.match(/(.+?) bags contain (.+)\./);

		const curBag = match[1];
		const inBagsStr = match[2];

		data[curBag] = {};

		if (inBagsStr === 'no other bags') {
			continue;
		}

		bags = inBagsStr.split(',').map(s => s.trim());

		for (const bag of bags) {
			const match = bag.match(/(\d+) (.+?) bag/);
			const count = parseInt(match[1], 10);
			const innerBag = match[2];

			data[curBag][innerBag] = count;
		}
	}

	console.log(getBagsCount('shiny gold') - 1);
}

main();