const fs = require('fs');

function main() {
	const chunks = fs.readFileSync('./chunks.txt')
		.toString()
		.split('\n')
		.map(line => line.split(''));

	const syntaxPoints = {
		')': 3,
		']': 57,
		'}': 1197,
		'>': 25137,
	};

	const completionPoints = {
		')': 1,
		']': 2,
		'}': 3,
		'>': 4,
	};

	const closing = {
		'[': ']',
		'{': '}',
		'(': ')',
		'<': '>',
	};

	const opening = Object.keys(closing);

	const syntaxErrCounts = {};
	const completionScores = [];

	CHUNKS: for (const chunk of chunks) {
		let completionScore = 0;
		let opened = [];

		for (const token of chunk) {
			if (opening.includes(token)) {
				opened.push(token);
			} else if (closing[opened.pop()] !== token) {
				syntaxErrCounts[token] = syntaxErrCounts[token] + 1 || 1;
				continue CHUNKS;
			}
		}

		while (opened.length) {
			completionScore = completionScore * 5 + completionPoints[closing[opened.pop()]];
		}

		completionScores.push(completionScore);
	}

	let syntaxErrScore = 0;

	for (const [token, n] of Object.entries(syntaxErrCounts)) {
		syntaxErrScore += syntaxPoints[token] * n;
	}

	const middleCompletionScore = completionScores
		.sort((a, b) => a - b)[Math.floor(completionScores.length/2)];

	console.log('syntax errors score:', syntaxErrScore);
	console.log('middle completion score:', middleCompletionScore);
}

main();

