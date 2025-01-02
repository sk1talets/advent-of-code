const fs = require('fs');

const mapWidth = 101;
const mapHeight = 103;

function moveRobot(robot) {
    let [x, y, vx, vy] = robot;

    x += vx;
    y += vy;

    // teleports
    x = x + mapWidth * Math.ceil(-x / mapWidth);
    y = y + mapHeight * Math.ceil(-y / mapHeight);

    x -= Math.floor(x / mapWidth);
    y -= Math.floor(y / mapHeight);

    robot[0] = x;
    robot[1] = y;
}

function main() {
    const robots = fs.readFileSync('./input.txt')
        .toString()
        .split('\n')
        .map(s => s.match(/-?\d+/g).map(Number));

    for (let seconds = 1;; seconds++) {
        for (const robot of robots) {
            moveRobot(robot);
        }

        const map = Array.from(Array(mapHeight), i => Array(mapWidth).fill(' '));

        for (const [x, y] of robots) {
            map[y][x] = '.';
        }

        const lines = map.map(row => row.join(''));
        const LINE = '.'.repeat('10');

        if (lines.find((line) => line.includes(LINE))) {
            console.log(lines.join('\n'));
            console.log(seconds);
            break;
        }
    }
}

    main();