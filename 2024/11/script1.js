const fs = require('fs');

function updateStone(num) {
    if (num === '0') {
        return '1';
    }


    if (num.length % 2 === 0) {
        return [
            num.slice(0, num.length/2),
            Number(num.slice(num.length/2)).toString(),
        ]
    }

    return String(num * 2024);
}

function main() {
    let stones = fs.readFileSync('./input.txt')
        .toString()
        .split(/\s+/);

    for (let n = 0; n < 25; n++) {
        stones = stones.map((num) => updateStone(num)).flat();
    }

    console.log(stones.length);
}

main();