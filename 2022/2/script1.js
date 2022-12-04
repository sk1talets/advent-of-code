const fs = require('fs');

function getShape(shape) {
	const map = {
		'X': 'A', // rock
		'Y': 'B', // paper
		'Z': 'C', // scissors
	};

	return map[shape];
}

function getShapeScore(shape) {
	const scores = {
		'A': 1,
		'B': 2,
		'C': 3,
	};

	return scores[shape];
}

function getRoundScore(my, their) {
	const win = {
		'A': 'C',
		'B': 'A',
		'C': 'B',
	};

	if (my == their) {
		return 3;
	}

	if (win[my] === their) {
		return 6;
	}

	return 0;
}

function main() {
	const input = fs.readFileSync('./input.txt')
		.toString()
		.split('\n')
		.map(s => s.split(' '));

	let total = 0;

	for (const [their, myXYZ] of input) {
		my = getShape(myXYZ);
		total += getRoundScore(my, their) + getShapeScore(my);
	}

	console.log(total);
}

main();