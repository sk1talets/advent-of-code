const fs = require('fs');

class Program {
	constructor(sourceCode) {
		this.pos = 0;
		this.input = [];
		this.output = [];
		this.relativeBase = 0;
		this.parseSourceCode(sourceCode);
		this.status = 'ready';
		this.inputCallback;
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

	setInputCallback(cb) {
		this.inputCallback = cb;
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
		if (pos < 0) {
			throw new Error(`pos can not be negative: ${pos}`);
		}

		const value = this.data[pos];
	
		return typeof value === 'undefined' ? 0 : value;
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

	getParameterMode(n) {
		const modes = this.getToken(0)
			.toString()
			.slice(0, -2)
			.split('')
			.reverse()
			.map(m => parseInt(m, 10) || 0);

		return n > modes.length ? 0 : modes[n - 1];
	}

	getParameter(n) {
		const arg = this.getToken(n);
		const mode = this.getParameterMode(n);

		let value;

		switch (mode) {
			case 0:
				value = this.getTokenAt(arg);
				break;
			case 1:
				value = arg;
				break;
			case 2:
				value = this.getTokenAt(this.relativeBase + arg);
				break;
			default:
				throw new Error(`unknown parameter mode ${mode}`);
		}

		this.log(`>> arg ${arg} mode ${mode} = ${value}`);

		return value;
	}

	getTargetParamter(n) {
		const arg = this.getToken(n);
		const mode = this.getParameterMode(n);

		let value;

		switch (mode) {
			case 0:
			case 1:
				value = arg;
				break;
			case 2:
				value = arg + this.relativeBase;
				break;
			default:
				throw new Error(`unexpected mode for target parameter: ${mode}`);
		}

		this.log(`>> target arg ${arg} mode ${mode} = ${value}`);

		return value;
	}

	opAdd() {
		const arg1 = this.getParameter(1);
		const arg2 = this.getParameter(2);
		const target = this.getTargetParamter(3)

		this.setTokenAt(target, arg1 + arg2);
		this.log(`${arg1} + ${arg2} = ${arg1 + arg2} -> ${target}`);
		
		this.shiftPosition(4);
	}

	opMultiply() {
		const arg1 = this.getParameter(1);
		const arg2 = this.getParameter(2);
		const target = this.getTargetParamter(3)

		this.setTokenAt(target, arg1 * arg2);
		this.log(`${arg1} * ${arg2} = ${arg1 * arg2} -> ${target}`);

		this.shiftPosition(4);
	}

	opInput() {
		let value = this.input.shift();

		if (this.inputCallback) {
			value = this.inputCallback();
		}
		
		const target = this.getTargetParamter(1);

		if (typeof value === 'undefined') {
			throw new Error(`no input at pos ${this.pos}`);
		}

		this.setTokenAt(target, value);
		this.log(`input ${value} -> ${target}`);

		this.shiftPosition(2);
	}

	opOutput() {
		const value = this.getParameter(1);
		
		this.log(`output ${value}`);
		this.output.push(value);

		this.shiftPosition(2);
	}

	opJumpIfTrue() {
		const arg = this.getParameter(1);
		const target = this.getParameter(2);
		
		if (arg !== 0) {
			this.setPosition(target);
			this.log(`jump (${arg} is true) -> ${target}`);
		} else {
			this.shiftPosition(3);
			this.log(`no jump (${arg} is not true)`);
		}
	}

	opJumpIfFalse() {
		const arg = this.getParameter(1);
		const target = this.getParameter(2);
		
		if (arg === 0) {
			this.setPosition(target);
			this.log(`jump (${arg} is false) -> ${target}`);
		} else {
			this.shiftPosition(3);
			this.log(`no jump (${arg} is not false)`);
		}
	}

	opLessThan() {
		const arg1 = this.getParameter(1);
		const arg2 = this.getParameter(2);
		const target = this.getTargetParamter(3);
		const value = arg1 < arg2 ? 1 : 0;

		this.setTokenAt(target, value);
		this.log(`set (${arg1} < ${arg2}) ${value} -> ${target}`);
		
		this.shiftPosition(4);
	}

	opEqualTo() {
		const arg1 = this.getParameter(1);
		const arg2 = this.getParameter(2);
		const target = this.getTargetParamter(3);
		const value = arg1 === arg2 ? 1 : 0;

		this.setTokenAt(target, value);
		this.log(`set (${arg1} == ${arg2}) ${value} -> ${target}`);

		this.shiftPosition(4);
	}

	opShiftRelativeBase() {
		const arg = this.getParameter(1);

		this.relativeBase += arg;
		this.log(`shift relative base by ${arg} -> ${this.relativeBase}`);

		this.shiftPosition(2);
	}

	setVerbose(value) {
		this.verbose = !!value;
	}

	log(msg) {
		if (this.verbose) {
			console.log('D:', msg);
		}
	}

	logData() {
		this.log(this.data.map((t,i) => `${i}:${t}, `).join(''));
	}

	run() {
		this.status = 'running';

		mainLoop: 
		while(true) {
			const op = this.getOperation();
			const opToken = this.getToken(0);
			
			this.log(`> op: ${op} (${opToken})`);

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
					break mainLoop;
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
				case 9:
					this.opShiftRelativeBase();
					break;
				case 99:
					this.status = 'halted';
					break mainLoop;
				default:
					throw new Error(`unknown operation ${op} (${opToken})`);
			}
		}
	}
}

class ASCII {
	constructor() {
		this.direction = 0;
		this.directions = [0, 1, 2, 3];
		this.x = 0;
		this.y = 0;
		this.map = [[]];

		this.restart();
	}

	restart() {
		this.program = new Program(fs.readFileSync('./program.txt').toString());
	}

	getPosAtDirection(dir) {
		const [x, y] = [this.x, this.y];
		const points = [
			[x, y - 1],
			[x + 1, y],
			[x, y + 1],
			[x - 1, y],
		];

		return points[dir];
	}

	getMapPointAtDirection(dir) {
		const [x, y] = this.getPosAtDirection(dir);
	
		if (this.map[y] && this.map[y][x]) {
			return this.map[y][x];
		}

		return null;
	}

	getDirectionBySide(side) {
		const sides = { 'F': 0, 'L': -1, 'R': 1 };
		const direction = (2 * 4 + this.direction + sides[side]) % 4;

		return direction;
	}

	getMapPointBySide(side) {
		const direction = this.getDirectionBySide(side)

		return this.getMapPointAtDirection(direction);
	}

	appendMapLine() {
		this.map.push([]);

		return this.getLastMapLine();
	}

	getLastMapLine() {
		return this.map[this.map.length - 1];
	}

	appendMapPoint(point) {
		const char = String.fromCharCode(point);

		if (char === '\n') {
			return this.appendMapLine();
		}

		this.getLastMapLine().push(char);
	}

	getCurPosition() {
		this.iterateOverMap((x, y) => {
			if (['^', '<', '>', 'v'].includes(this.map[y][x])) {
				[this.x, this.y] = [x, y];
				
				return false;
			}
		});

		return [this.x, this.y];
	}

	iterateOverMap(cb) {
		for (let y = 0; y < this.map.length; y++) {
			for (let x = 0; x < this.map[y].length; x++) {
				if (cb(x, y) === false) {
					return;
				}
			}
		}
	}

	printMap() {
		let yy = 0;

		this.iterateOverMap((x, y) => {
			if (yy !== y) {
				process.stdout.write('\n');
				yy = y;
			}
			process.stdout.write(this.map[y][x]);
		});

		process.stdout.write('\n\n');
	}

	getAdjacent(x, y) {
		const adjacent = [
			[x, y - 1],
			[x + 1, y],
			[x, y + 1],
			[x - 1, y],
		];
		
		return adjacent.map(([xx, yy]) => {
			if (this.map[yy] && this.map[yy][xx]) {
				return this.map[yy][xx];
			}

			return null;
		});
	}

	getInterSections() {
		let result = 0;

		this.iterateOverMap((x, y) => {
			if (this.map[y][x] !== '#') {
				return;
			}

			const adjacent = this.getAdjacent(x, y);
			const adjacentPaths = adjacent.filter(s => s === '#');

			if (adjacentPaths.length === 4) {
				result += x * y;
			}
		});

		return result;
	}

	getPath() {
		const path = [];

		this.getCurPosition();

		let steps = 0;

		loop:
		while (true) {
			let pathFound = false;

			for (const side of ['F', 'L', 'R']) {
				if (this.getMapPointBySide(side) !== '#') {
					continue;
				}

				pathFound = true;

				if (side === 'F') {
					[this.x, this.y] = this.getPosAtDirection(this.direction);
					steps++;
					continue loop;
				}

				this.direction = this.getDirectionBySide(side);

				if (steps) {
					path.push(steps);
					steps = 0;
				}
				
				path.push(side);

				continue loop;
			}

			path.push(steps);

			break;
		}

		return path;
	}

	discoverArea() {
		while (true) {
			this.program.run();

			const output = this.program.getLastOutput();

			if (output) {
				this.appendMapPoint(output);
			}

			if (this.program.getStatus() === 'halted') {
				break;
			}
		}
	}

	run() {
		let status;

		while (status !== 'halted') {
			this.program.run();
			status = this.program.getStatus();
		}

		return this.program.getLastOutput();
	}
}

function main() {
	const ascii = new ASCII();

	ascii.discoverArea();
	ascii.printMap();

	let result = ascii.getInterSections();

	console.log('Intersections:', result);

	const memorySize = 20;
	const path = ascii.getPath();
	const pathString = path.join();

	const pieces = [];

	for (let i = 0; i < path.length; i++) {
		if (typeof path[i] === 'number') {
			// piece should not start with a number
			continue;
		}

		for (let j = i + 2; j < i + memorySize; j++) {
			if (typeof path[j] !== 'number') {
				// piece should end with a number
				continue;
			}

			piece = path.slice(i, j + 1).join();

			const match = pathString.match(new RegExp(piece, 'g'));

			if (match && match.length > 1) {
				pieces.push(piece);
			}
		}
	}

	const findCombination = (path, chosen = []) => {
		if (path.length === 0) {
			return chosen;
		}

		for (const piece of chosen) {
			if (path.startsWith(piece)) {
				return findCombination(path.substr(piece.length + 1), chosen)
			}
		}

		if (chosen.length === 3) {
			return [];
		}

		for (const piece of pieces) {
			if (path.startsWith(piece)) {
				const result = findCombination(path.substr(piece.length + 1), [...chosen, piece]);

				if (result.length) {
					return result;
				}

			}
		}

		return [];
	}

	const functions = findCombination(pathString);

	let mainRoutine = pathString;

	for (let i = 0; i < functions.length; i++) {
		const startCharCode = 'A'.charCodeAt(0);
		const functionName = String.fromCharCode(startCharCode + i);

		mainRoutine = mainRoutine.split(functions[i]).join(functionName)
	}

	console.log('Main routine:', mainRoutine);
	console.log('Functions', functions);

	// wake up
	ascii.restart();
	ascii.program.setTokenAt(0, 2);

	// main routine
	for (const token of mainRoutine.split('')) {
		ascii.program.addInput(token.charCodeAt(0));
	}
	
	ascii.program.addInput(10);

	// functions
	for (const f of functions) {
		for (const token of f.split('')) {
			ascii.program.addInput(token.charCodeAt(0))
		}

		ascii.program.addInput(10);
	}

	// videou feed
	ascii.program.addInput('n'.charCodeAt(0));
	ascii.program.addInput(10);

	const dustCollected = ascii.run();

	console.log('Dust collected:', dustCollected);
}

main();