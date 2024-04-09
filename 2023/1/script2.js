const fs = require('fs');

const DIGITS = [
    'zero', 'one', 'two', 'three', 'four',
    'five', 'six', 'seven', 'eight', 'nine'
];

const DIGITS_REGEXP_STRING = DIGITS
    .flatMap((word, num) => ([word, num])).join('|');

function main() {
	const lines = fs.readFileSync('./input.txt')
		.toString()
		.split('\n');

    let result = 0;

    lines.forEach((line) => {
        const matches = [];

        for (let i = 0; i < line.length; i++) {
            const int = parseInt(line[i]);

            if (int) {
                matches[i] = int;
                continue;
            }

            DIGITS.forEach((word) => {
                if (line.substring(i, i + word.length) === word) {
                    matches[i] = DIGITS.indexOf(word);
                }
            });
        }

        const numbers = matches.filter((n) => n);

        result += numbers[0] * 10 + numbers[numbers.length - 1];
    });

    console.log(result);
}

main();