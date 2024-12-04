const fs = require('fs');

function getSymbol(symbols, x, y) {
    return symbols[y]?.[x] ?? '';
}

function searchXShapeMAS(symbols, x, y) {
    if (getSymbol(symbols, x, y) !== 'A') {
        return 0;
    }

    let s1, s2;

    s1 = getSymbol(symbols, x - 1, y - 1);
    s2 = getSymbol(symbols, x + 1, y + 1);

    if (!['MS', 'SM'].includes(`${s1}${s2}`)) {
        return 0;
    }

    s1 = getSymbol(symbols, x - 1, y + 1);
    s2 = getSymbol(symbols, x + 1, y - 1);

    if (!['MS', 'SM'].includes(`${s1}${s2}`)) {
        return 0;
    }

    return 1;
}

function main() {
    const symbols = fs.readFileSync('./input.txt')
        .toString()
        .split('\n')
        .map((line) => line.split(''));

    let wordsCount = 0;

    for (let y = 0; y < symbols.length; y++) {
        for (let x = 0; x < symbols[y].length; x++) {
            wordsCount += searchXShapeMAS(symbols, x, y)
        }
    }

    console.log(wordsCount);
}

main();