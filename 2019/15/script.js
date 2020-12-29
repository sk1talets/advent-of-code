const { dir } = require('console');
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

class RepairDroid {
	constructor() {
		this.program = new Program(fs.readFileSync('./program.txt').toString());
		this.x = 0;
		this.y = 0;
		this.direction = 1;
		this.directions = [1, 4, 2, 3];
		this.map = {0: {0: 0}};
	}

	getDirection(n) {
		const L = this.directions.length;
		const curIndex = this.directions.indexOf(this.direction);
		const newIndex = (curIndex + n + L) % L;

		return this.directions[newIndex];
	}

	setDirection(dir) {
		this.direction = dir;
	}

	setMapPoint(x, y, type) {
		if (!this.map[y]) {
			this.map[y] = {};
		}

		this.map[y][x] = type;
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}

	sendMove(direction) {
		let x = this.x;
		let y = this.y;

		switch (direction) {
			case 1: // north
				y++;
				break;
			case 2: // south
				y--;
				break;
			case 3: // west
				x--;
				break;
			case 4: // east
				x++;
				break;
		}

		this.program.addInput(direction);
		this.program.run();
		
		const status = this.program.getLastOutput();

		switch (status) {
			case 0:
				this.setMapPoint(x, y, 2);
				break;
			case 1:
				this.setMapPoint(x, y, 0);
				this.setPosition(x, y);
				break;
			case 2:
				this.setMapPoint(x, y, 1);
				this.setPosition(x, y);
				break;
		}

		return status;
	}

	discoverArea() {
		while (true) {
			for (let side = -1; side < 3; side++) {
				if (this.program.getStatus() === 'halted') {
					return;
				}

				const dir = this.getDirection(side);

				if (this.sendMove(dir)) {
					this.setDirection(dir);

					break;
				}
			}

			if (!this.x && !this.y) {
				break;
			}
		}
	}

	getMap() {
		return this.map;
	}

	printMap() {
		const margin = 1;

		let [minX, minY] = [Infinity, Infinity];
		let [maxX, maxY] = [0, 0];

		for (let y in this.map) {
			y = parseInt(y);

			minY = y < minY ? y : minY;
			maxY = y > maxY ? y : maxY;

			for (let x in this.map[y]) {
				x = parseInt(x);

				minX = x < minX ? x : minX;
				maxX = x > maxX ? x : maxX;
			}
		}

		for (let y = maxY + margin; y >= minY - margin; y--) {
			if (!this.map[y]) {
				process.stdout.write('\n');
				continue;
			}

			for (let x = minX - margin; x <= maxX + margin; x++) {
				let symbol = ' ';

				switch (this.map[y][x]) {
					case 0:
						symbol = !x && !y ? '*' : ' ';
						break;
					case 1:
						symbol = 'X';
						break;
					case 2:
						symbol = '#';
						break;
	
				}

				process.stdout.write(symbol);
			}

			process.stdout.write('\n');
		}
	}

	run() {
		this.discoverArea();

		return this.map;
	}
}

function getPossibleDirections(map, x, y, prevX, prevY) {
	const adjacent = [
		[x, y - 1],
		[x + 1, y],
		[x, y + 1],
		[x - 1, y],
	];

	const result = [];

	for (const [xx, yy] of adjacent) {
		if (xx === prevX && yy === prevY) {
			continue;
		}

		if (map[yy][xx] < 2) {
			result.push([xx, yy]);
		}
	}

	return result;
}

function getStepsToOxygenSystem(map, X = 0, Y = 0, prevX = 0, prevY = 0, steps = 0) {
	if (map[Y][X] === 1) { // OxygenSystem
		return steps;
	}

	const directions = getPossibleDirections(map, X, Y, prevX, prevY);

	if (directions.length === 0) {
		return Infinity; // dead end
	}

	const stepCounts = [];

	for (const [xx, yy] of directions) {
		stepCounts.push(getStepsToOxygenSystem(map, xx, yy, X, Y, steps + 1));
	}

	return Math.min(...stepCounts);
}

function getLongestPath(map, X = 0, Y = 0, prevX = 0, prevY = 0, steps = 0) {
	const directions = getPossibleDirections(map, X, Y, prevX, prevY);

	if (directions.length === 0) {
		return steps; // dead end
	}

	const stepCounts = [];

	for (const [xx, yy] of directions) {
		stepCounts.push(getLongestPath(map, xx, yy, X, Y, steps + 1));
	}

	return Math.max(...stepCounts);
}

function main() {
	const droid = new RepairDroid();

	droid.run();
	droid.printMap();

	const map = droid.getMap();

	let steps;

	steps = getStepsToOxygenSystem(map);
	
	console.log('Shortest path to OS:', steps);

	// part two
	let osX, osY;

	for (let y in map) {
		for (let x in map[y]) {
			if (map[y][x] === 1) {
				[osX, osY] = [parseInt(x), parseInt(y)];
			}
		}
	}

	console.log('OS position:', osX, osY);

	steps = getLongestPath(map, osX, osY);

	console.log('Longest path from OS:', steps);
}

main();