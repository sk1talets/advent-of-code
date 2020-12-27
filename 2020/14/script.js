const fs = require('fs');
const Bignum = require('bignum');

function applyMask(num, mask) {
	const numBin = num.toString(2).split('').reverse();
	const maskArr = mask.split('').reverse();
	const result = [];

	for (let i = 0; i < maskArr.length; i++) {
		switch (maskArr[i]) {
			case 'X':
				result[i] = 'X';
				break;
			case '0':
				result[i] = numBin[i] || 0;
				break;
			case '1':
				result[i] = 1;
				break;
			default:
				throw new Error(`unexpected mask token ${mask[i]}`);
		}
	}

	return result.reverse().join('');
}

function getCombinations(values, result = [], curValue = '', pos = 0) {
	for (const value of values[pos]) {
		if (pos + 1 < values.length) {
			getCombinations(values, result, curValue + value, pos + 1);	
		} else {
			result.push(curValue + value);
		}
	}

	return result;
}

function getAddressCombinations(mask) {
	const values = mask.split('').map(t => {
		if (t === 'X') {
			return ['0', '1'];
		}

		return [t];
	});

	return getCombinations(values);
}

function main() {
	const program = fs.readFileSync('./program-test.txt').toString().split('\n');

	const memory = {};
	let curMask;

	for (const line of program) {
		tokens = line.split(/\s+=\s+/);

		switch (true) {
			case tokens[0] === 'mask':
				curMask = tokens[1];

				break;
			case tokens[0].startsWith('mem'): {
				const m = tokens[0].match(/mem\[(\d+)\]/);

				if (!m) {
					throw new Error(`failed to parse mem token: ${tokens[0]}`);
				}

				const address = parseInt(m[1], 10);
				const value = parseInt(tokens[1], 10);
				const addressMask = applyMask(address, curMask)
				const addresses = getAddressCombinations(addressMask);

				for (const address of addresses) {
					memory[address] = value;
				}

				break;
			}
		}
	}

	console.log(memory);

	let sum = Bignum(0);

	for (const value of Object.values(memory)) {
		const bigValue = Bignum(value, 2)

		sum = sum.add(bigValue);
	}

	console.log(sum.toString());
}

main();