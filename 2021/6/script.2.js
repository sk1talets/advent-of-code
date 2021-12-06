const fs = require('fs');

function main() {
	const days = 256;
	const counts = Array(9).fill(0);
	
	fs.readFileSync('./ages.txt')
		.toString()
		.split(',')
		.map(n => parseInt(n, 10))
		.forEach(n => counts[n] += 1);

	for (let i = 0; i < days; i++) {
		const newCount = counts.shift();
		counts[6] += newCount;
		counts.push(newCount);
	}

	console.log('total:', counts.reduce((count, total) => count + total));
}

main();