const fs = require('fs');

function main() {
    const map = [];
	const lines = fs.readFileSync('./input.txt')
		.toString()
		.split('\n')
        .map((line) => {
            const curLine = [];

            line.split('').forEach((point) => {
                curLine.push(point)
            });
            
            map.push(curLine);
        });

    let result = 0;
    let partNumber = '';

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            const symbol = map[i][j];
            const isNumber = !isNaN(symbol);

            if (!isNumber) {
                if (partNumber) {
                    if (partNumber < 0) {
                        result += -partNumber;
                    }

                    partNumber = '';    
                }

                continue;
            }

            partNumber += symbol;

            LOOKAROUND: 
            for (let ii = i - 1; ii <= i + 1; ii++) {
                for (let jj = j - 1; jj <= j + 1; jj++) {
                    const adjacent = map[ii]?.[jj] ?? '';

                    if (adjacent && isNaN(adjacent) && adjacent !== '.') {
                        // adjacent symbol found
                        if (partNumber[0] !== '-') {
                            partNumber = '-' + partNumber;
                            break LOOKAROUND;
                        }
                    }
                }
            }
        }
    }

    console.log(result);
}

main();