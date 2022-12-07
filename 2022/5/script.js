const fs = require('fs');

function main() {
	const input = fs.readFileSync('./input.txt')
		.toString()
		.split('\n');

	const stacks = [];

	for (const line of input) {
		if (line.startsWith('move')) {
			const [N, from, to] = line.match(/\d+/g).map(s => parseInt(s));

			/* part 1
			for (let i = 0; i < N; i++) {
				stacks[to - 1].push(stacks[from - 1].pop());
			}
			*/

			const crane = [];

			for (let i = 0; i < N; i++) {
				crane.unshift(stacks[from - 1].pop());
			}

			for (const crate of crane) {
				stacks[to - 1].push(crate);
			}

			continue;
		}

		if (!line) {
			continue;
		}

		const crates = line
			.match(/.{3,4}/g)
			.map(s => s.match(/[A-Z]/)?.[0]);

		for (const [i, crate] of crates.entries()) {
			if (!stacks[i]) {
				stacks[i] = [];
			}

			if (crate) {
				stacks[i].unshift(crate);
			}
		}
	}

	console.log(stacks.map(s => s[s.length - 1]).join(''));
}

main();