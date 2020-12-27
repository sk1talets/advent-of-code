const fs = require('fs');

function getOp(data, pos) {
	return data[pos] % 100;
}

function getParam(data, pos, n) {
	const inst = data[pos];
	const paramModes = inst.toString().slice(0, -2).split('').reverse();
	const value = data[pos + n];
	const paramMode = parseInt(paramModes[n - 1], 10) || 0;

	return paramMode === 1 ? value : data[value];
}

let count = 0;

function runProgram(data) {
	let done = false;
	let pos = 0;

	while (!done) {
		const op = getOp(data, pos);
		
		switch (op) {
			case 1: {
				const arg1 = getParam(data, pos, 1);
				const arg2 = getParam(data, pos, 2);
				const targetPos = data[pos + 3];
		
				data[targetPos] = arg1 + arg2;

				pos += 4;
				break;
			}
			case 2: {
				const arg1 = getParam(data, pos, 1);
				const arg2 = getParam(data, pos, 2);
				const targetPos = data[pos + 3];
		
				data[targetPos] = arg1 * arg2;

				pos += 4;
				break;
			}
			case 3: {
				const arg = 5; // single input they say
				const targetPos = data[pos + 1];

				data[targetPos] = arg;

				pos += 2;
				break;
			}
			case 4: {
				const arg = getParam(data, pos, 1);
	
				console.log('->', arg);

				pos += 2;
				break;
			}
			case 5: {
				const arg1 = getParam(data, pos, 1);
				const arg2 = getParam(data, pos, 2);
				
				//console.log('D: OP 5', arg1, arg2);

				if (arg1 !== 0) {
					pos = arg2;
				} else {
					pos += 3;
				}

				break;
			}
			case 6: {
				const arg1 = getParam(data, pos, 1);
				const arg2 = getParam(data, pos, 2);
	
				//console.log('D: OP 6', arg1, arg2);

				if (arg1 === 0) {
					pos = arg2;
				} else {
					pos += 3;
				}

				break;
			}
			case 7: {
				const arg1 = getParam(data, pos, 1);
				const arg2 = getParam(data, pos, 2);
				const targetPos = data[pos + 3];
		
				//console.log('D: OP 7', arg1, arg2);

				data[targetPos] = arg1 < arg2 ? 1 : 0;

				pos += 4;
				break;
			}
			case 8: {
				const arg1 = getParam(data, pos, 1);
				const arg2 = getParam(data, pos, 2);
				const targetPos = data[pos + 3];
		
				//console.log('D: OP 8', arg1, arg2);

				data[targetPos] = arg1 === arg2 ? 1 : 0;

				pos += 4;
				break;
			}
			case 99:
				done = true;
				break;
			default:
				throw new Error(`unexpected code: ${op} at position ${pos}`);
		}
	}

	return data[0];
}

function main() {
	const data = fs.readFileSync('./program.txt').toString().trim().split(',').map(s => parseInt(s, 10));

	runProgram(data);
}

main();