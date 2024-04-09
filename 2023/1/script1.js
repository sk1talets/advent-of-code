const fs = require('fs');

function main() {
	const lines = fs.readFileSync('./input.txt')
		.toString()
		.split('\n');

    let sum = 0;

    lines.map((line) => {
        let first, last;

        line.split('').forEach((char) => {
            const num = parseInt(char);

            if (isNaN(num)) {
                return;
            }

            if (typeof first === 'undefined') {
                first = num;
            }

            last = num;
        });

        sum += first * 10 + last;
    });

    console.log(sum);
}

main();