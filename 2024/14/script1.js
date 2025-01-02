const fs = require('fs');

const mapWidth = 101;
const mapHeight = 103;

const seconds = 100;

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

    const quadrants = {};

    for (let i = 0; i < seconds; i++) {
        for (const robot of robots) {
            moveRobot(robot);
        }
    }

    const middleX = Math.floor(mapWidth / 2);
    const middleY = Math.floor(mapHeight / 2);

    for (const [x, y] of robots) {
        if (x === middleX || y === middleY) {
            continue;
        }

        const key = [x < middleX, y < middleY];

        quadrants[key] = (quadrants[key] || 0) + 1;
    }

    const result = Object.values(quadrants)
        .reduce((res, v) => res * v, 1);

    console.log(result);
}

    main();