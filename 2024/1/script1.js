const fs = require('fs');

function main() {
    const list1 = [];
    const list2 = [];

    fs.readFileSync('./input.txt')
        .toString()
        .split('\n')
        .forEach((s) => {
            const [v1, v2] = s.split(/\s+/)
                .map(s => parseInt(s));

            list1.push(v1);
            list2.push(v2);
        });

    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);

    let result = 0;

    for (let i = 0; i < list1.length; i++) {
        result += Math.abs(list1[i] - list2[i]);
    }

    console.log(result);
}

main();