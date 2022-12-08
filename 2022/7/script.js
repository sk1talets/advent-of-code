const fs = require('fs');

function main() {
	const input = fs.readFileSync('./input.txt')
		.toString()
		.split('\n');

	const files = {};

	let curPath = '';

	for (const line of input) {
		let match = line.match(/^\$ (\S+) (\S+)/);

		if (match) {
			const [cmd, arg] = [match[1], match[2]];

			switch (cmd) {
				case 'cd':
					if (arg === '..') {
						curPath = files[curPath].basePath;
						break;
					}

					const newPath = `${curPath}/${arg}`;

					files[newPath] = {
						type: 'dir',
						basePath: curPath,
						size: 0,
					}

					curPath = newPath;

					break;
			}

			continue;
		}

		match = line.match(/^dir (\S+)/);

		if (match) {
			files[`${curPath}/${match[1]}`] = {
				type: 'dir',
				basePath: curPath,
				size: 0,
			};

			continue;
		}

		match = line.match(/^(\d+) (\S+)/)

		if (match) {
			files[`${curPath}/${match[2]}`] = {
				type: 'file',
				basePath: curPath,
				size: parseInt(match[1], 10),
			};
		}
	}


	const updateSize = (path, size) => {
		if (path) {
			files[path].size += size;
			updateSize(files[path].basePath, size);
		}
	}

	for (const file of Object.values(files)) {
		updateSize(file.basePath, file.size);
	}

	/* part 1
	let result = 0;

	for (const path in files) {
		const file = files[path];

		if (file.type === 'dir' && file.size < 100000) {
			result += file.size;
		}
	}

	console.log(result);
	*/

	const maxSpace = 70000000;
	const requiredSpace = 30000000;
	const spaceAvailable = maxSpace - files['//'].size;
	const needToFreeUp = requiredSpace - spaceAvailable;

	const result = Object.values(files)
		.filter(f => f.type === 'dir')
		.sort((a, b) => a.size - b.size)
		.find(f => f.size > needToFreeUp)
		.size;

	console.log(result);
}

main();