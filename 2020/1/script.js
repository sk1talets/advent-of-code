const fs = require('fs');

function main() {
	const nums = fs.readFileSync('./numbers.txt').toString().split('\n').map(n => parseInt(n, 10));

	for (let i = 0; i < nums.length; i++) {
		for (let j = i; j < nums.length; j++) {
			if (nums[i] + nums[j] === 2020) {
				console.log(nums[i], ' + ', nums[j], '; res = ', nums[i] * nums[j]);
			}
		}
	}
}

main();