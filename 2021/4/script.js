const fs = require('fs');

function checkBoard(board, nums) {
	const size = board[0].length;
	const hits = new Array(size * 2).fill(0);
	
	let win = false;
	let notHitSum = 0;

	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			if (nums.includes(board[i][j])) {
				if (++hits[i] === size || ++hits[j+size] === size) {
					win = true;
				}
			} else {
				notHitSum += board[i][j];
			}
		}
	}

	return [win, notHitSum];
}

function main() {
	const lines = fs.readFileSync('./boards.txt').toString().split('\n');
	const nums = lines.shift().split(',').map(n => parseInt(n, 10));
	const boards = [];

	let board;

	for (const line of lines) {
		if (line === '') {
			board = [];
			boards.push(board);
		} else {
			board.push(line.trim().split(/\s+/).map(n => parseInt(n, 10)));
		}
	}

	for (let i = 0; i < nums.length; i++) {
		for (let j = 0; j < boards.length; j++) {
			if (!boards[j]) {
				continue;
			}

			const [win, notHitSum] = checkBoard(boards[j], nums.slice(0, i));

			if (win) {
				console.log(`board ${j + 1} won! score:`, notHitSum * nums[i - 1]);
				boards[j] = null;
			}
		}
	}
}

main();