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

function reverseBit(bit) {
	return bit === '1' ? '0' : '1'
}

function getDefaultBit(type) {
	switch (type) {
		case 'o2':
			return '1';
		case 'co2':
			return '0';
	}
}

function getBitCriteria(type, nums, pos) {
	const commonBit = getCommonBitAt(nums, pos);

	if (commonBit === null) {
		return getDefaultBit(type);
	} 

	if (type === 'co2') {
		return reverseBit(commonBit)
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

	if (nums.length > 1) {
		return;
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