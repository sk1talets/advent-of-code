const fs = require('fs');

function numberIsValid(set, number) {
	for (let i = 0; i < set.length; i++) {
		for (let j = 0; j < set.length; j++) {
			if (set[i] != set[j] && set[i] + set[j] === number) {
				return true;
			}
		}
	}

	return false;
}

function main() {
	const numbers = fs.readFileSync('./numbers.txt').toString().split('\n').map(s => parseInt(s, 10));

/*
	const preamleLength = 25;
	const preamble = [];

	for (const number of numbers) {
		console.log(preamble);
		if (preamble.length < preamleLength) {
			preamble.push(number);
		} else if (preamble.length === preamleLength) {
			if(!numberIsValid(preamble, number)) {
				console.log(`number ${number} is not valid`);
				break;
			}

			preamble.push(number);
			preamble.shift();
		}
	}
*/

	const N = 2089807806;

	for (let i = 0; i < numbers.length; i++) {
		let sum = numbers[i];

		for (let j = i+1; j < numbers.length; j++) {
			sum += numbers[j];

			if (sum === N) {
				let min = sum;
				let max = 0;
				for (let k = i; k <= j; k++) {
					if (numbers[k] < min) {
						min = numbers[k];
					}

					if (numbers[k] > max) {
						max = numbers[k];
					}

					console.log('->', numbers[k]);
				}
				console.log(min, max, min + max);
				return;
			} else if (sum > N) {
				break;
			}
		}
	}
}

main();