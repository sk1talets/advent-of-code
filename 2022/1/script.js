const fs = require('fs');

function main() {
	const calories = fs.readFileSync('./calories.txt')
		.toString()
		.split('\n');

	calories.push('');

	/* part 1

	let [cur, max] = [0, 0];

	for (const entry of calories) {
		if (!entry) {
			[max, cur] = cur > max ? [cur, 0] : [max, 0];
		} else {
			cur += parseInt(entry, 10);
		}
	}

	console.log(max);
	*/

	let [max, cur] = [[], 0];

	for (const entry of calories) {
		if (!entry) {
			max = [...max, cur].sort((a, b) => b - a).slice(0, 3);
			cur = 0;
		} else {
			cur += parseInt(entry, 10);
		}
	}

	console.log(max[0] + max[1] + max[2]);
}

main();