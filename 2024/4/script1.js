const fs = require('fs');

function getSymbol(symbols, x, y) {
    return symbols[y]?.[x] ?? '';
}

function searchWordInDirection(symbols, word, x, y, shiftX, shiftY) {
    for (const wordSymbol of word) {
        if (getSymbol(symbols, x, y) !== wordSymbol) {
            return 0;
        }

        x += shiftX;
        y += shiftY;
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
            for (let shiftX = -1; shiftX <= 1; shiftX++) {
                for (let shiftY = -1; shiftY <= 1; shiftY++) {
                    wordsCount += searchWordInDirection(symbols, 'XMAS', x, y, shiftX, shiftY)
                }
            }
        }
    }

    console.log(wordsCount);
}

main();