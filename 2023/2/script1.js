const fs = require('fs');

function main() {
	const lines = fs.readFileSync('./input.txt')
		.toString()
		.split('\n');

    const numberOfCubes = {
        // 12 red cubes, 13 green cubes, and 14 blue cubes
        'red': 12,
        'green': 13,
        'blue': 14,
    };

    let result = 0;

    ROUND: for (const round of lines) {
        const match = round.match(/Game (\d+): (.+)/);
        const [_, roundIdSting, output] = match || [];
        const roundId = parseInt(roundIdSting, 10);

        for (const game of output.split(/;\s+/)) {
            for (const cube of game.split(/,\s+/)) {
                const [_, numString, color] = cube.match(/(\d+) (\w+)/) || [];
                const num = parseInt(numString, 10);

                if (color in numberOfCubes && num > numberOfCubes[color]) {
                    continue ROUND;
                }
            }
        }

        result += roundId;
    }

    console.log(result);
}

main();