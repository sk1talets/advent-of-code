const fs = require('fs');

function runProgram(data, noun, verb) {
	data[1] = noun;
	data[2] = verb;

	main:
	for (let pos = 0; pos < data.length; pos += 4) {
		const op = data[pos];
		const num1Pos = data[pos + 1];
		const num2Pos = data[pos + 2];
		const targetPos = data[pos + 3];

		switch (op) {
			case 1:
				data[targetPos] = data[num1Pos] + data[num2Pos];
				break;
			case 2:
				data[targetPos] = data[num1Pos] * data[num2Pos];
				break;
			case 99:
				break main;
			default:
				throw new Error(`unexpected code: ${op} at position ${pos}`);
	

		}
	}

	return data[0];
}

function main() {
	const data = fs.readFileSync('./program.txt').toString().trim().split(',').map(s => parseInt(s, 10));

	for (let noun = 0; noun < 100; noun++) {
		for (let verb = 0; verb < 100; verb++) {
			const result = runProgram(data.slice(), noun, verb);

			if (result === 19690720) {
				console.log(100 * noun + verb)
			}
		}
	
	}
}

main();