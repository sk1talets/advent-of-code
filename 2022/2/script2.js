const fs = require('fs');

function main() {
	const input = fs.readFileSync('./input.txt')
		.toString()
		.split('\n')
		.map(s => s.split(' '));

	const scores = {
		'A': 1,
		'B': 2,
		'C': 3,
	};

	const win = {
		'A': 'B',
		'B': 'C',
		'C': 'A',
	};

	const lose = {
		'A': 'C', // rock
		'B': 'A', // paper
		'C': 'B', // scissors
	};

	let score = 0;

	for (let [shape, result] of input) {
		switch (result) {
			case 'X': // lose
				score += 0;
				score += scores[lose[shape]];
				break;
			case 'Y': // draw
				score += 3;
				score += scores[shape];
				break;
			case 'Z': // win
				score += 6;
				score += scores[win[shape]];
				break;
		}
	}

	console.log(score);
}

main();