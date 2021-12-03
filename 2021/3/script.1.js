const fs = require('fs');

function main() {
	let counts = [];
	let total = 0;
	
	fs.readFileSync('./data.txt')
		.toString()
		.split('\n')
		.forEach(num => {
			for (i in num) {
				if (!counts[i]) {
					counts[i] = 0;
				}
				counts[i] += num[i] === '1';
			}
			total++;
		})
	
	const gammaRate = parseInt(counts.map(c => c > total/2 ? '1' : '0').join(''), 2);
	const epsilonRate = parseInt(counts.map(c => c > total/2 ? '0' : '1').join(''), 2);

	console.log('gamma:', gammaRate, 'epsilon:', epsilonRate);
	console.log('result:', gammaRate * epsilonRate);
}

main();