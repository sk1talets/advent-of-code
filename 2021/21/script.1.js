const fs = require('fs');

function main() {
	const lines = fs.readFileSync('./input.txt').toString().split('\n');
	const positions = lines.map(line => parseInt(line.match(/\d+$/)[0], 10));
	const scores = Array.from(positions).fill(0);

	let diceValue = 1;
	let diceRolls = 0;

	game: while (true) {
		for (let i = 0; i < positions.length; i++) {
			for (let n = 0; n < 3; n++) {
				positions[i] += (diceValue++ - 1) % 100 + 1;
				diceRolls++;
			}

			positions[i] = (positions[i] - 1) % 10 + 1;
			scores[i] += positions[i];

			if (scores[i] >= 1000) {
				console.log(`Player ${i + 1} wins! Result: ${scores[(i + 1) % scores.length] * diceRolls}`);
				break game;
			}
		}
	}
}

main();