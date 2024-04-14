const fs = require('fs');

function main() {
    const map = [];
	const lines = fs.readFileSync('./input.txt')
		.toString()
		.split('\n')
        .map((line) => {
            const curLine = [];

            line.split('').forEach((point) => {
                curLine.push(point);
            });
            
            map.push(curLine);
        });

    const stars = {};

    let partNumber = '';
    let partStars = [];

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            const symbol = map[i][j];
            const isNumber = !isNaN(symbol);

            if (!isNumber) {
                if (partNumber) {
                    partStars.forEach((id) => {
                        const parts = stars[id] ?? [];

                        if (!parts.includes(partNumber)) {
                            parts.push(partNumber);
                        }

                        stars[id] = parts;
                    });

                    partNumber = '';    
                    partStars = [];
                }

                continue;
            }

            partNumber += symbol;

            LOOKAROUND: 
            for (let ii = i - 1; ii <= i + 1; ii++) {
                for (let jj = j - 1; jj <= j + 1; jj++) {
                    const adjacent = map[ii]?.[jj] ?? '';

                    if (adjacent === '*') {
                        const starId = [ii, jj].join();

                        if (!partStars.includes(starId)) {
                            partStars.push(starId);

                            break LOOKAROUND;
                        }
                    }
                }
            }
        }
    }

    const result = Object.values(stars)
        .reduce((sum, nums) => {
            return nums.length === 2 ? sum + nums[0] * nums[1] : sum;
        }, 0);

    console.log(result)
}

main();