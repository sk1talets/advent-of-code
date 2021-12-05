const fs = require('fs');

function getCommonBitAt(nums, pos) {
	let counts = {'0': 0, '1': 0};

	for (const num of nums) {
		if (++counts[num[pos]] > nums.length/2) {
			return num[pos];
		}
	}

	return null
}

function getBitCriteria(type, nums, pos) {
	const commonBit = getCommonBitAt(nums, pos);

	if (commonBit === null) {
		return type === 'o2' ? '1' : '0'
	} 

	if (type === 'co2') {
		return commonBit === '1' ? '0' : '1'
	}

	return commonBit;
}

function getRating(data, type) {
	let nums = [...data];

	const numLength = nums[0].length;

	for (let pos = 0; pos < numLength; pos++) {
		const bit = getBitCriteria(type, nums, pos);

		nums = nums.filter(num => {
			return num[pos] === bit;
		})

		if (nums.length === 1) {
			break;
		}
	}

	return parseInt(nums[0], 2)
}

function main() {
	const data = fs.readFileSync('./data.txt').toString().split('\n');

	const o2gen = getRating(data, 'o2');
	const co2gen = getRating(data, 'co2');

	console.log('O2:', o2gen, 'CO2:', co2gen);
	console.log('result:', o2gen * co2gen);
}

main();