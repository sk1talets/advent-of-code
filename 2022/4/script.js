const fs = require('fs');

function main() {
	const sections = fs.readFileSync('./assignment.txt')
		.toString()
		.split('\n')
		.map(s => s.split(/[\-,]/).map(n => parseInt(n)));

	let count = 0;

	/* part 1
	for (let [a, b, A, B] of sections) {
		if (Math.abs(a - b) > Math.abs(A - B)) {
			[a, b, A, B] = [A, B, a, b];
		}

		count += a >= A && b <= B;
	}
	*/

	for (let [a, b, A, B] of sections) {
		if (a > A) {
			[a, b, A, B] = [A, B, a, b];
		}

		count += b >= A;
	}

	console.log(count);
}

main();