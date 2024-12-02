const fs = require('fs');

function main() {
    const changes = fs.readFileSync('./input.txt')
        .toString()
        .split('\n')
        .map(s => parseInt(s));

    let F = 0;
    const seenF = { [F]: true };

    while (true) {
        for (const delta of changes) {
            F += delta;

            if (F in seenF) {
                console.log(F);
                return;
            }

            seenF[F] = true;
        }
    }
}

main();