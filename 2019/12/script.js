const fs = require('fs');

let AXIS = ['x', 'y', 'z'];

function updateVelocities(objs) {
	for (let i = 0; i < objs.length; i++) {
		for (let j = 0; j < objs.length; j++) {
			if (i > j) {
				continue;
			}

			const obj1 = objs[i];
			const obj2 = objs[j];

			for (const axis of AXIS) {
				if (obj1[axis] === obj2[axis]) {
					continue;
				} 

				if (obj1[axis] > obj2[axis]) {
					obj1.v[axis]--;
					obj2.v[axis]++;
				} else {
					obj1.v[axis]++;
					obj2.v[axis]--;
				}
			}
		}
	}
}

function updatePositions(objs) {
	for (let i = 0; i < objs.length; i++) {	
		for (const axis of AXIS) {
			objs[i][axis] += objs[i].v[axis];
		}
	}
}

function updateEnergies(objs) {
	for (const o of objs) {
		o.Ep = Math.abs(o.x) + Math.abs(o.y) + Math.abs(o.z);
		o.Ek = Math.abs(o.v.x) + Math.abs(o.v.y) + Math.abs(o.v.z);
		o.E = o.Ek * o.Ep;
	}
}

function match(obj1, obj2) {
	for (const axis of AXIS) {
		if (obj1[axis] !== obj2[axis]) {
			return false;
		}

		if (obj1.v[axis] !== obj2.v[axis]) {
			return false;
		}
	}

	return true;
}

function statesMatch(objs1, objs2) {
	for (let i = 0; i < objs1.length; i++) {
		if (!match(objs1[i], objs2[i])) {
			return false;
		}
	}

	return true;
}

function copyObj(obj) {
	return { ...obj, v: { ...obj.v }};
}

function getTotalEnergy(objs) {
	let E = 0;

	objs.forEach(o => E += o.E);

	return E;
}

function print(objs) {
	for (const o of objs) {
		process.stdout.write(`pos=<x=${o.x}, y=${o.y}, z=${o.z}> `);
		process.stdout.write(`vel=<x=${o.v.x}, y=${o.v.y}, z=${o.v.z}>\n`);
	}

	process.stdout.write('\n');
}

function update(moons) {
	updateVelocities(moons);
	updatePositions(moons);
	updateEnergies(moons);
}

function main() {
	const lines = fs.readFileSync('./positions.txt').toString().split('\n');

	const moons = [];

	for (const line of lines) {
		const match = line.match(/<x=(?<x>.+?), y=(?<y>.+?), z=(?<z>.+?)>/);

		if (!match) {
			throw new Error(`failed to parse line: ${line}`);
		}

		moons.push({
			x: parseInt(match.groups.x),
			y: parseInt(match.groups.y),
			z: parseInt(match.groups.z),

			v: {
				x: 0,
				y: 0,
				z: 0,	
			},

			Ek: 0,
			Ep: 0,
			E: 0
		});
	}

	const moons_ = moons.map(m => copyObj(m));

	const periods = [];

	for (const axis of [...AXIS]) {
		AXIS = [axis];
		let t = 0;

		while (true) {
			t++;

			update(moons);

			if (statesMatch(moons, moons_)) {
				break;
			};	
		}

		periods.push(t);
	}

	const maxPeriod = Math.max(...periods);

	for (let i = 1;; i++) {
		const T = maxPeriod * i;

		if (!periods.find(p => T % p)) {
			console.log(T);
			break;
		}
	}
}

main();
