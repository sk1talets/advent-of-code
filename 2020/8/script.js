const fs = require('fs');

function runProgram(commands) {
	let pos = 0;
	let acc = 0;

	const log = {};

	while (true) {
		if (pos >= commands.length) {
			break;
		}

		const [op, arg] = commands[pos];

		if (pos in log) {
			return [false, acc];
		} else {
			log[pos] = 1;
		}

		switch (op) {
			case 'acc':
				acc += arg;
				pos++;
				break;
			case 'jmp':
				pos += arg
				break;
			case 'nop':
				pos++
				break;
			default:
				throw new Error(`unknown operation: ${op}`);
		}
	}

	return [true, acc]
}

function main() {
	const program = fs.readFileSync('./program.txt').toString().split('\n');
	const commands = [];

	for (const line of program) {
		const [op, arg] = line.split(/\s+/);
		commands.push([op, parseInt(arg, 10)]);
	}

	const fixTried = {};

	while (true) {
		let fixMade = false;
		const testCommands = [];

		for (const cmd of commands) {
			testCommands.push([...cmd]);
		}
	
		for (let i = 0; i <= testCommands.length; i++) {
			if (testCommands[i][0] === 'jmp' && !fixTried[i]) {
				testCommands[i][0] = 'nop';
				fixTried[i] = true;
				fixMade = true;

				break;
			}
		}

		if (!fixMade) {
			break;
		}

		const [res, acc] = runProgram(testCommands);
	
		console.log(res, acc);

		if (res) {
			break;
		} 
	}
}

main();