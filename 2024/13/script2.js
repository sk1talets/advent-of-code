const fs = require('fs');

const [costA, costB] = [3, 1];
const delta = 10 ** 13;

function getCombination(Xa, Ya, Xb, Yb, X, Y) {
    const XX = X + delta;
    const YY = Y + delta;

    console.log(XX, YY);

    const Na = (YY*Xb - Yb * XX) / (Ya * Xb - Yb * Xa);
    const Nb = (YY - Ya*Na) / Yb;

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