const fs = require('fs');

function main() {
	const commands = fs.readFileSync('./course.txt')
		.toString()
		.split('\n')
		.map(l => l.split(/\s+/))
		.map(c => [c[0], parseInt(c[1], 10)]);

	let depth = 0;
	let position = 0;

	for (const command of commands) {
		const [direction, value] = command;

		switch (direction) {
			case 'forward':
				position += value;
				break;
			case 'up':
				depth -= value;
				break;
			case 'down':
				depth += value;
				break;
			default:
				console.log('unknown command', command);
		}
	}

	console.log('position:', position, 'depth:', depth);
	console.log('result:', position * depth); // answer 1

	let aim = 0;
	depth = 0;
	position = 0;

	for (const command of commands) {
		const [direction, value] = command;

		switch (direction) {
			case 'forward':
				position += value;
				depth += aim * value;
				break;
			case 'up':
				aim -= value;
				break;
			case 'down':
				aim += value;
				break;
			default:
				console.log('unknown command', command);
		}
	}

	console.log('position:', position, 'depth:', depth);
	console.log('result:', position * depth); // answer 2
}

main();