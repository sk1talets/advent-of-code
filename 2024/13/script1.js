const fs = require('fs');

const [costA, costB] = [3, 1];

function getCombination(Xa, Ya, Xb, Yb, X, Y) {
    const Na = (Y * Xb - Yb * X) / (Ya * Xb - Yb * Xa);
    const Nb = (Y - Ya * Na) / Yb;

    return [Na, Nb];
}

function main() {
    const machines = fs.readFileSync('./input.txt')
        .toString()
        .split('\n\n')
        .map(s => s.match(/\d+/g).map(Number));

    let result = 0;

    for (const machine of machines) {
        const [Na, Nb] = getCombination(...machine);

        if (Number.isInteger(Na) && Number.isInteger(Nb)) {
            result += Na * costA + Nb * costB;
        }
    }

    console.log(result);
}

    main();