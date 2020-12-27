const fs = require('fs');

class Program {
	constructor(sourceCode) {
		this.pos = 0;
		this.input = [];
		this.output = [];
		this.relativeBase = 0;
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
		const value = this.input.shift();
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

class PaintingRobot {
	constructor() {
		this.curDirection = 0;
		this.X = 0;
		this.Y = 0;
		this.program = new Program(fs.readFileSync('./program.txt').toString());
		this.sides = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
		this.plates = {};
		this.verbose = false;
	}

	setVerbose(value) {
		this.verbose = !!value;
	}

	log(msg) {
		if (this.verbose) {
			console.log('D:', msg);
		}
	}

	trun(direction) {
		switch (direction) {
			case 0: // left
				this.curDirection = (this.curDirection + 3) % this.sides.length;
				break;
			case 1: // right
				this.curDirection = (this.curDirection + 1) % this.sides.length;
				break;
			default:
				throw new Error(`unknown turn direction: ${direction}`);
		}
	}

	getDirection() {
		return this.sides[this.curDirection];
	}

	moveForward() {
		const dir = this.getDirection();

		switch (dir) {
			case 'UP':
				this.Y++;
				break;
			case 'DOWN':
				this.Y--;
				break;
			case 'RIGHT':
				this.X++;
				break;
			case 'LEFT':
				this.X--;
				break;
			default:
				throw new Error(`unknown direction: ${dir}`);
		}
	}

	
	getPosStr(x, y) {
		return [x, y].join();
	}

	paint(color, x, y) {
		this.plates[this.getPosStr(x, y)] = [color, x, y];
	}

	printCanvas() {
		const plates = Object.values(this.plates);

		let [minX, minY] = [0, 0];

		for (const [_, x, y] of plates) {
			minX = x < minX ? x : minX;
			minY = y < minY ? y : minY;
		}

		const canvas = [];

		for (const [color, x, y] of plates) {
			const xx = x + Math.abs(minX);
			const yy = y + Math.abs(minY);

			if (typeof canvas[yy] === 'undefined') {
				canvas[yy] = [];
			}

			canvas[yy][xx] = color;
		}

		for (let y = canvas.length - 1; y >= 0; y--) {
			for (let x = 0; x < canvas[y].length; x++) {
				process.stdout.write(canvas[y][x] ? '█' : ' ')
			}
			process.stdout.write('\n')
		}
	}

	getColor() {
		const pos = this.getPosStr(this.X, this.Y);
		const color = pos in this.plates ? this.plates[pos][0] : 0; // black by default

		return color;
	}

	getPaintedPlates() {
		return Object.keys(this.plates).length;
	}

	run() {
		while (this.program.getStatus() !== 'halted') {
			this.program.addInput(this.getColor())

			this.program.run();
			const color = this.program.getLastOutput();

			this.log(`painting color ${color} at ${this.X},${this.Y}`);
			this.paint(color, this.X, this.Y);

			this.program.run();
			const direction = this.program.getLastOutput();
			
			this.log(`direction to turn ${direction}`);
			this.trun(direction);
			this.moveForward();
		}
	}
}

function main() {
	const robot = new PaintingRobot();

	robot.paint(1, 0, 0);
	robot.run();
	robot.printCanvas();
}

main();
