const fs = require('fs');

function main() {
    let score = 0;

    fs.readFileSync('./input.txt')
		.toString()
		.split('\n')
        .map((line) => {
            const [_, wining, ours] = line.match(/Card\s+\d+:\s+(.+)\s+\|\s+(.+)/);

            const winingNumbers = wining.split(/\s+/);
            const numberOfWining = ours
                .split(/\s+/)
                .filter((num) => winingNumbers.includes(num))
                .length;

            score += numberOfWining ? 2 ** (numberOfWining - 1) : 0;
        });

    console.log(score);
}

main();