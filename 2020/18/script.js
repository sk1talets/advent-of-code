const fs = require('fs');

function getRPN(expression) {
	const output = [];
	const ops = [];

	for (const token of expression) {
		switch (token) {
			case '*':
				while (true) {
					const lastOp = ops[ops.length - 1];
					if (!lastOp || !['+', '*'].includes(lastOp)) break;
					output.push(ops.pop());
				}
				ops.push(token);
				break;
			case '+':
			case '(':
				ops.push(token);
				break;
			case ')':
				while (true) {
					const op = ops.pop();
					if (!op || op === '(') {
						break;
					}
					output.push(op);
				}
				break;
			default:
				output.push(token);
		}
	}

	while (ops.length) {
		output.push(ops.pop());
	}

	return output;
}

function solve(expression) {
	const rpnExpression = getRPN(expression);
	const args = [];

	for (const token of rpnExpression) {
		if (!isNaN(token)) {
			args.push(token);

			continue;
		}

		if (args.length < 2) {
			throw new Error(`not enough args for ${token}`);
		}

		const arg1 = args.pop();
		const arg2 = args.pop();

		switch (token) {
			case '+':
				args.push(arg1 + arg2);
				break;
			case '*':
				args.push(arg1 * arg2);
				break;
			default:
				throw new Error(`unexpected operator ${token}`);
		}
	}

	if (args.length > 1) {
		throw new Error(`insufficent operators, result: ${args.join()}`);
	}

	return args[0];
}

function main() {
	const lines = fs.readFileSync('./homework.txt').toString().split('\n');

	const expressions = [];

	for (const line of lines) {
		expressions.push(line.split(/\s*/).map(s => parseInt(s) || s));
	}

	let result = 0;

	for (const expr of expressions) {
		result += solve(expr);
	}

	console.log(result);
 }

main();