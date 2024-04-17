const fs = require('fs');

function main() {
	const [time, distance] = fs.readFileSync('./input.txt')
		.toString()
		.split('\n')
        .map((line) => line.match(/(\d+)/g).join(''))
        .map(n => (parseInt(n, 10)));

    const D = Math.sqrt(time * time - 4 * distance);
    const x1 = (time - D)/2;
    const x2 = (time + D)/2;

    const from = Math.floor(x1 + 1);
    const to = Math.ceil(x2 - 1);

    const result = to - from + 1;

    console.log(result);
}

main();