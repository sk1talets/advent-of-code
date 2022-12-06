const fs = require('fs');

function getPriority(sym) {
	const [first, shift] = sym.match(/[a-z]/) ? ['a', 1] : ['A', 27];

	return sym.charCodeAt() - first.charCodeAt() + shift;
}

function main() {
	const rucksacks = fs.readFileSync('./input.txt')
		.toString()
		.split('\n');

	let priorities = 0;

	for (const items of rucksacks) {
		const sectionSize = items.length/2;
		const seen = {};

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const section = Math.floor(i/sectionSize);

			if (item in seen) {
				if (section !== seen[item]) {
					console.log(item, getPriority(item));
					priorities += getPriority(item);
					delete seen[item];
				}
			} else {
				seen[item] = section;
			}
		}
	}

	console.log(priorities);
}

main();