const fs = require('fs');

function main() {
    const changes = fs.readFileSync('./input.txt')
        .toString()
        .split('\n')
        .map(s => parseInt(s));


    let F = 0;

    for (const delta of changes) {
        F += delta;
    }

    console.log(F);
}

main();