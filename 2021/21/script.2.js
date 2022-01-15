const fs = require('fs');

const cache = {};

const getOutcomeSums = (values, sums = [], curSum = 0, depth = 0) => {
	if (depth === values.length) {
		sums.push(curSum);
	} else {
		for (const value of values) {
			getOutcomeSums(values, sums, curSum + value, depth + 1);
		}
	}

	return sums;
};

function play(scores, positions, sums, depth = 0) {
  const cacheKey = `${scores}:${positions}:${depth}`;

	if (cache[cacheKey]) {
		return cache[cacheKey];
	}

	const player = depth % scores.length;
	const score = scores[player];
	const position = positions[player];

	let wins = [0, 0];

	for (let i = 0; i < sums.length; i++) {
		let newPosition = position + sums[i];
		newPosition = (newPosition - 1) % 10 + 1;

		newScore = score + newPosition;

		if (newScore >= 21) {
			wins[player]++;
			continue;
		}

		const scores_ = [...scores];
		const positions_ = [...positions];

		scores_[player] = newScore;
		positions_[player] = newPosition;

		const wins_ = play(scores_, positions_, sums, depth + 1);

		wins = wins.map((num, player) => num + wins_[player]);
	}

	cache[cacheKey] = wins;

	return wins;
}

function main() {
	const lines = fs.readFileSync('./input.txt').toString().split('\n');
	const positions = lines.map(line => parseInt(line.match(/\d+$/)[0], 10));
	const scores = Array.from(positions).fill(0);

	const sums = getOutcomeSums([1, 2, 3]);
	const wins = play(scores, positions, sums);

	console.log(`result: ${Math.max(...wins)}`);
}

main();