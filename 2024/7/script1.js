const fs = require('fs');

function isSolvable(args, result) {
    const [arg1, arg2, ...restArgs] = args;

    for (const op of ['*', '+']) {
        const res = eval(`${arg1}${op}${arg2}`);

        if (res > result) {
            continue;
        }

        if (!restArgs.length) {
            if (res === result) {
                return true;
            }

            continue;
        }

        if (isSolvable([res, ...restArgs], result)) {
            return true;
        }
    }

    return false;
}


function main() {
    const equations = fs.readFileSync('./input.txt')
        .toString()
        .split('\n')
        .map((line) => line.split(/[:\s]+/).map(s => parseInt(s)));

    let sum = 0;

    for (const [result, ...args] of equations) {
        sum += isSolvable(args, result) ? result : 0;
    }

    console.log(sum);
}

main();