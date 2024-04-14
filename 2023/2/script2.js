const fs = require('fs');

function main() {
	const lines = fs.readFileSync('./input.txt')
		.toString()
		.split('\n');

    let result = 0;

    ROUND: for (const round of lines) {
        const validSet = {
            'red': 0,
            'blue': 0,
            'green': 0,
        };

        const match = round.match(/Game (\d+): (.+)/);
        const [_, roundIdSting, output] = match || [];
        const roundId = parseInt(roundIdSting, 10);

        for (const game of output.split(/;\s+/)) {
            for (const cube of game.split(/,\s+/)) {
                const [_, numString, color] = cube.match(/(\d+) (\w+)/) || [];
                const num = parseInt(numString, 10);

                if (validSet[color] < num) {
                    validSet[color] = num;
                }
            }
        }

        result += Object.values(validSet).reduce((res, cur) => res * cur, 1);
    }

    console.log(result);
}

main();