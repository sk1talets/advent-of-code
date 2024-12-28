const fs = require('fs');

function updateStone(num) {
    if (num === '0') {
        return ['1'];
    }

    if (num.length % 2 === 0) {
        return [
            num.slice(0, num.length/2),
            Number(num.slice(num.length/2)).toString(),
        ]
    }

    return [String(num * 2024)];
}

function main() {
    let stones = fs.readFileSync('./input.txt')
        .toString()
        .split(/\s+/)
        .reduce((count, n) => ({...count, [n]: (count[n] ?? 0) + 1}), {});

    for (let i = 0; i < 75; i++) {
        for (const [stone, count] of Object.entries(stones)) {
            const newStones = updateStone(stone);

            for (const newStone of newStones) {
                stones[newStone] = (stones[newStone] ?? 0) + count;
            }

            stones[stone] -= count;
        }
    }

    const result = Object.values(stones)
        .reduce((sum, v) => sum + v, 0);

    console.log(result);
}

main();