const fs = require('fs');

function main() {
	const [times, distances] = fs.readFileSync('./input.txt')
		.toString()
		.split('\n')
        .map((line) => line.match(/(\d+)/g).map(n => parseInt(n, 10)));

    let result = 1;

    times.forEach((time, i) => {
        const distance = distances[i];

        const D = Math.sqrt(time * time - 4 * distance);
        const x1 = (time - D)/2;
        const x2 = (time + D)/2;

        const from = Math.floor(x1 + 1);
        const to = Math.ceil(x2 - 1);

        result *= to - from + 1;
    });

    console.log(result);
}

main();