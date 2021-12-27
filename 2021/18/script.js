const fs = require('fs');

function getNodes(number, parent = null, nodes = []) {
	const [left, right] = number;
	const node = { parent };

	nodes.push(node);

	node.left = Array.isArray(left) ? getNodes(left, node, nodes) : left;
	node.right = Array.isArray(right) ? getNodes(right, node, nodes) : right;

	return parent ? node : nodes;
}

function updateRight(node, value, prev) {
	if (node === null) {
		return;
	}

	if (node.right === prev) {
		return updateRight(node.parent, value, node);
	}

	if (node.left === prev) {
		if (typeof node.right === 'object') {
			return updateLeft(node.right, value);
		}
	}

	if (typeof node.right === 'object') {
		return updateRight(node.right, value);
	}

	node.right += value;
}

function updateLeft(node, value, prev) {
	if (node === null) {
		return;
	}

	if (node.left === prev) {
		return updateLeft(node.parent, value, node);
	}

	if (node.right === prev) {
		if (typeof node.left === 'object') {
			return updateRight(node.left, value);
		}
	}

	if (typeof node.left === 'object') {
		return updateLeft(node.left, value);
	}

	node.left += value;
}

function split(nodes, node = null) {
	if (!node) {
		return split(nodes, nodes[0]);
	}

	for (const side of ['left', 'right']) {
		if (typeof node[side] === 'object') {
			const res = split(nodes, node[side]);

			if (res) {
				return res;
			}
		}

		if (node[side] >= 10) {
			newNode = {
				parent: node,
				left: Math.floor(node[side]/2),
				right: Math.ceil(node[side]/2),
			};

			node[side] = newNode;
			nodes.push(newNode);

			return true;
		}
	}

	return false;
}

function explode(node, depth = 0) {
	if (Array.isArray(node)) {
		return explode(node[0]);
	}

	const {parent, left, right} = node;

	for (const side of ['left', 'right']) {
		if (typeof node[side] === 'object') {
			const res = explode(node[side], depth + 1);

			if (res) {
				return res;
			}
		}
	}

	if (depth >= 4) {
		updateLeft(parent, left, node);
		updateRight(parent, right, node);

		parent.left === node ? parent.left = 0 : parent.right = 0;

		return true;
	}
}

function reduce(nodes) {
	while (true) {
		if (!explode(nodes) && !split(nodes)) {
			break;
		}
	}

	return nodes;
}

function getNumber(node) {
	if (!node) {
		return node;
	}

	return [
		typeof node.left === 'object' ? getNumber(node.left) : node.left,
		typeof node.right === 'object' ? getNumber(node.right) : node.right,
	]
}

function printNumber(nodes) {
	console.log(JSON.stringify(getNumber(nodes[0])));
}

function add(nodes1, nodes2) {
	const newParent = {
		parent: null,
		left: nodes1[0],
		right: nodes2[0],
	};

	nodes1[0].parent = newParent;
	nodes2[0].parent = newParent;

	return reduce([
		newParent,
		...nodes1,
		...nodes2,
	]);
}

function getMagnitude(node) {
	if (Array.isArray(node)) {
		return getMagnitude(node[0]);
	}

	let result = 0;

	for (const side of ['left', 'right']) {
		const multiplier = side === 'left' ? 3 : 2;

		if (typeof node[side] === 'object') {
			result += multiplier * getMagnitude(node[side]);
		} else {
			result += multiplier * node[side];
		}
	}

	return result;
}

function main() {
	const numbers = fs.readFileSync('./numbers.txt')
		.toString()
		.split('\n')
		.map(line => eval(line));

	let sum;

	for (const number of numbers) {
		const nodes = getNodes(number);

		if (!sum) {
			sum = nodes;
			continue;
		}

		sum = add(sum, nodes);
	}

	console.log('total sum magnitude:', getMagnitude(sum));

	let maxMagnitude = 0;

	for (const a of numbers) {
		for (const b of numbers) {
			const magnitude = getMagnitude(add(getNodes(a), getNodes(b)));

			if (maxMagnitude < magnitude) {
				maxMagnitude = magnitude;
			}
		}
	}

	console.log('largest sum magnitude:', maxMagnitude);
}

main();

