const fs = require('fs');

function getPriority(sym) {
	const [first, shift] = sym.match(/[a-z]/) ? ['a', 1] : ['A', 27];

	return sym.charCodeAt() - first.charCodeAt() + shift;
}

function main() {
	const rucksacks = fs.readFileSync('./input.txt')
		.toString()
		.split('\n');

	const groupSize = 3;

	let seen = {};
	let priorities = 0;

	for (const [i, items] of rucksacks.entries()) {
		const member = i % groupSize;

		for (const item of items) {
			seen[item] = seen[item]?.add(member) || new Set([member]);

			if (seen[item].size === groupSize) {
				priorities += getPriority(item);
				seen = {};
				break;
			}
		}
	}

	console.log(priorities);
}

main();