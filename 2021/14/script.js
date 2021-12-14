const fs = require('fs');

function main() {
	const [pattern, instructions] = fs.readFileSync('./manual.txt').toString().split('\n\n');
		
	const pairs = {};
	const rules = {};
	const count = {};

	// count pairs in the pattern
	for (let i = 0; i < pattern.length - 1; i++) {
		const key = [pattern[i], pattern[i+1]].join('');
		pairs[key] = pairs[key] + 1 || 1; 
	}
	
	// parse rules
	for (const line of instructions.split('\n')) {
		const [pair, insert] = line.split(' -> ');

		rules[pair] = insert;
		pair in pairs ? null : pairs[pair] = 0;
	}

	// update pair counts
	for (let step = 0; step < 40; step++) {
		for (const [pair, count] of Object.entries(pairs)) {
			const [a, b] = pair.split('');
			const c = rules[pair];
			
			pairs[[a, b].join('')] -= count;
			pairs[[a, c].join('')] += count;
			pairs[[c, b].join('')] += count;
		}
	}

	// count symbols
	for (const [[symbol], n] of Object.entries(pairs)) {
		count[symbol] = count[symbol] + n || n;
	}

	// count the last element
	count[pattern[pattern.length - 1]]++;

	const sorted = Object.values(count).sort((a, b) => b - a);
	
	console.log('result:', sorted[0] - sorted[sorted.length - 1]);
}

main();

