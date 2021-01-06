const fs = require('fs');

function initSums(signal) {
	const sums = [];

	let sum = 0;

	for (let i in signal) {
		sum += signal[i];
		sums[i] = sum;
	}

	return sums;
}

function getSum(from, to, sums) {
	const sumsFrom = from ? sums[(from - 1) % sums.length] : 0;
	const sumsTo = sums[to % sums.length];

	return sumsTo - sumsFrom;
}

function cleanUpPhase(signal, offset) {
	const sums = initSums(signal);

	const result = [];

	for (let r = 1; r <= signal.length; r++) {
		if (r <= offset) {
			result.push(0);
			continue;
		}
	
		let num = 0;
		let sign = 1;

		for (let i = r - 1; i < signal.length; i += 2 * r) {
			let j = i + r - 1;

			if (j > signal.length - 1) {
				j = signal.length - 1;
			}

			num += sign * getSum(i, j, sums);

			sign = -sign;
		}

		result.push(Math.abs(num) % 10);
	}

	return result;
}


function cleanUp(inputSignal) {
	const offset = parseInt(inputSignal.substr(0, 7));

	let signal = inputSignal.split('').map(s => parseInt(s));

	for (let i = 1; i <= 100; i++) {
		console.log('FFT phase:', i);
		signal = cleanUpPhase(signal, offset);
	}

	return signal.slice(offset, offset + 8).join('');
}

function main() {
	const baseSignal = fs.readFileSync('./signal.txt').toString();

	let signal = '';

	for (let i = 0; i < 10000; i++) {
		signal += baseSignal;
	}
	
	signal = cleanUp(signal);

	console.log(signal);
}

main();
