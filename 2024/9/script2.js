const fs = require('fs');

function main() {
    const map = fs.readFileSync('./input.txt')
        .toString();

    const files = [];
    const empty = [];

    let pos = 0;
    let fileId = 0;

    // parse
    for (let i = 0; i < map.length; i++) {
        const num = parseInt(map[i], 10);

        if (i % 2 === 0) {
            files.push({
                id: fileId++,
                begin: pos,
                length: num,
            });
        } else {
            empty.push({
                begin: pos,
                length: num,
            });
        }

        pos += num;
    }

    // move files
    for (let i = files.length - 1; i >= 0; i--) {
        const file = files[i];

        for (const emptyBlock of empty) {
            if (emptyBlock.begin > file.begin || emptyBlock.length < file.length) {
                continue;
            }

            file.begin = emptyBlock.begin;

            emptyBlock.begin += file.length;
            emptyBlock.length -= file.length;
        }
    }

    let checksum = 0;

    files.forEach(({id, begin, length}) => {
        for (let i = begin; i < begin + length; i++) {
            checksum += id * i;
        }
    });

    console.log(checksum);
}

main();