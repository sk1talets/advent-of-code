const fs = require('fs');

function main() {
    const list1 = [];
    const list2 = {};

    fs.readFileSync('./input.txt')
        .toString()
        .split('\n')
        .forEach((s) => {
            const [v1, v2] = s.split(/\s+/)
                .map(s => parseInt(s));

            list1.push(v1);
            list2[v2] = (list2[v2] ?? 0) + 1;
        });

    let result = 0;

    list1.forEach((v) => {
        result += v * (list2[v] ?? 0);
    });

    console.log(result);
}

main();