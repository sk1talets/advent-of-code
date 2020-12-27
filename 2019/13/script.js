const fs = require('fs');
const term = require( 'terminal-kit' ).terminal ;

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

class Game {
	constructor() {
		this.program = new Program(fs.readFileSync('./game.txt').toString());
		this.screen = [];
		this.score = 0;
		this.paddlePosX = 0;
		this.ballPosX = 0;
	}

	setTile(x, y, tile) {
		if (!this.screen[y]) {
			this.screen[y] = [];
		}

		this.screen[y][x] = tile;
	}

	getScore() {
		return this.score;
	}

	printScreen() {
		term.moveTo(0, 0);

		for (let y = 0; y < this.screen.length; y++) {
			if (!this.screen[y]) {
				continue;
			}

			for (let x = 0; x < this.screen[y].length; x++) {
				let tileId = this.screen[y][x];

				if (typeof tileId !== 'number') {
					continue;
				}

				switch (tileId) {
					case 0:
						term.black(' ');
						break;
					case 1:
						term.blue('█');
						break;
					case 2:
						term.green('▒');
						break;
					case 3:
						term.brightRed('▂');
						break;
					case 4:
						term.brightCyan('☺');
						break;
					default:
						throw new Error(`unexpected tile id ${tileId} at ${x}:${y}`);	
				}		
			}
			term.nextLine();
		}
	}

	insertCoin() {
		this.program.setTokenAt(0, 2);
	}

	run() {
		this.program.setInputCallback(() => {
			if (this.ballPosX === this.paddlePosX) {
				return 0;
			}

			return this.ballPosX > this.paddlePosX ? 1 : -1;
		});
		
		term.clear();

		while (true) {
			this.program.run();
			const x = this.program.getLastOutput();

			this.program.run();
			const y = this.program.getLastOutput();

			this.program.run();
			const value = this.program.getLastOutput();

			if (this.program.getStatus() === 'halted') {
				break;
			}

			if (x === -1 && y === 0) {
				this.score = value;
			} else {				
				this.setTile(x, y, value);
				
				switch (value) {
					case 3:
						this.paddlePosX = x;
						break;
					case 4:
						this.ballPosX = x;
						break;
				}
			}

			this.printScreen();
		}

		term.nextLine();
	}
}

function main() {
	const game = new Game();

	game.insertCoin();
	game.run();

	term.red(`your score: ${game.getScore()}`);
	term.nextLine();
}

main();