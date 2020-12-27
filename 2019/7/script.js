const fs = require('fs');

class Program {
	constructor(sourceCode) {
		this.pos = 0;
		this.input = [];
		this.output = [];
		this.parseSourceCode(sourceCode);
		this.status = 'ready';
		this.verbose = false;
	}

	parseSourceCode(sourceCode) {
		this.data = sourceCode.split(',').map(s => parseInt(s, 10));
	}

	getStatus() {
		return this.status;
	}

	getData() {
		return this.data
	}

	addInput(input) {
		this.input.push(input);
	}

	setPosition(pos) {
		this.pos = pos;
	}

	shiftPosition(n) {
		this.pos += n;
	}

	getToken(n) {
		return this.data[this.pos + n];
	}

	getTokenAt(pos) {
		return this.data[pos];
	}

	setTokenAt(pos, value) {
		this.data[pos] = value;
	}

	getOperation() {
		return this.getToken(0) % 100;
	}
 
	getOutput() {
		return [...this.output];
	}

	getLastOutput() {
		return this.getOutput().pop();
	}

	getParamModes() {
		return this.getToken(0)
			.toString()
			.slice(0, -2)
			.split('')
			.reverse()
			.map(m => parseInt(m, 10) || 0)
	}

	getArgument(n) {
		const arg = this.getToken(n);
		const modes = this.getParamModes();
		const mode = modes[n - 1];

		return mode === 1 ? arg : this.getTokenAt(arg);
	}

	opAdd() {
		const arg1 = this.getArgument(1);
		const arg2 = this.getArgument(2);
		const target = this.getToken(3)

		this.setTokenAt(target, arg1 + arg2);
		this.log(`${arg1} + ${arg2} = ${arg1 + arg2} -> ${target}`);
		
		this.shiftPosition(4);
	}

	opMultiply() {
		const arg1 = this.getArgument(1);
		const arg2 = this.getArgument(2);
		const target = this.getToken(3)

		this.setTokenAt(target, arg1 * arg2);
		this.log(`${arg1} * ${arg2} = ${arg1 * arg2} -> ${target}`);

		this.shiftPosition(4);
	}

	opInput() {
		const value = this.input.shift();
		const target = this.getToken(1);

		if (typeof value === 'undefined') {
			throw new Error(`no input at pos ${this.pos}`);
		}

		this.setTokenAt(target, value);
		this.log(`input ${value} -> ${target}`);

		this.shiftPosition(2);
	}

	opOutput() {
		const value = this.getArgument(1);
		
		this.log(`output ${value}`);
		this.output.push(value);

		this.shiftPosition(2);
	}

	opJumpIfTrue() {
		const arg = this.getArgument(1);
		const target = this.getArgument(2);
		
		if (arg !== 0) {
			this.setPosition(target);
			this.log(`jump (${arg} is true) -> ${target}`);
		} else {
			this.shiftPosition(3);
			this.log(`no jump (${arg} is not true)`);
		}
	}

	opJumpIfFalse() {
		const arg = this.getArgument(1);
		const target = this.getArgument(2);
		
		if (arg === 0) {
			this.setPosition(target);
			this.log(`jump (${arg} is fals) -> ${target}`);
		} else {
			this.shiftPosition(3);
			this.log(`no jump (${arg} is not false)`);
		}
	}

	opLessThan() {
		const arg1 = this.getArgument(1);
		const arg2 = this.getArgument(2);
		const target = this.getToken(3);
		const value = arg1 < arg2 ? 1 : 0;

		this.setTokenAt(target, value);
		this.log(`set (${arg1} < ${arg2}) ${value} -> ${target}`);
		
		this.shiftPosition(4);
	}

	opEqualTo() {
		const arg1 = this.getArgument(1);
		const arg2 = this.getArgument(2);
		const target = this.getToken(3);
		const value = arg1 === arg2 ? 1 : 0;

		this.setTokenAt(target, value);
		this.log(`set (${arg1} = ${arg2}) ${value} -> ${target}`);

		this.shiftPosition(4);
	}

	setVerbose(value) {
		this.verbose = !!value;
	}

	log(msg) {
		if (this.verbose) {
			console.log('D:', msg);
		}
	}

	run() {
		this.status = 'running';

		mainLoop: 
		while(true) {
			const op = this.getOperation()

			switch(op) {
				case 1:
					this.opAdd();
					break;
				case 2:
					this.opMultiply();
					break;
				case 3:
					this.opInput();
					break;
				case 4:
					this.opOutput();
					return
				case 5:
					this.opJumpIfTrue()
					break;
				case 6:
					this.opJumpIfFalse()
					break;
				case 7:
					this.opLessThan();
					break;
				case 8:
					this.opEqualTo();
					break;		
				case 99:
					this.status = 'halted';
					break mainLoop;
			}
		}
	}
}

function getCombinations(values, result = [], curCombination = []) {
	if (curCombination.length >= values.length) {
		result.push(curCombination);
	}

	for (const value of values) {
		if (curCombination.includes(value)) {
			continue;
		}
		
		getCombinations(values, result, [...curCombination, value]);
	}

	return result;
}

function main() {
	const program = fs.readFileSync('./program.txt').toString();
	const settingsCombinations = getCombinations([5, 6, 7, 8, 9]);

	const amplifiersCount = 5;

	let maxSignalValue = 0;
	let maxSettings;

	for (const settings of settingsCombinations) {
		const amplifiers = [];
	
		for (let i = 0; i < amplifiersCount; i++) {
			const amp = new Program(program);

			amp.addInput(settings[i]);
			amp.setVerbose(false);
			amplifiers.push(amp);
		}
	
		let signalValue = 0;

		while (amplifiers[0].getStatus() != 'halted') {
			for (const amp of amplifiers) {
				amp.addInput(signalValue);
				amp.run();

				signalValue = amp.getLastOutput();
			}
		}

		if (signalValue > maxSignalValue) {
			maxSignalValue = signalValue;
			maxSettings = settings;
		};
	}

	console.log(maxSignalValue, maxSettings);
}

main();