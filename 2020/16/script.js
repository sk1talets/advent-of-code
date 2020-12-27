const fs = require('fs');

function main() {
	const lines = fs.readFileSync('./input.txt').toString().split('\n');

	let section = 'rules';

	const rules = {};
	const tickets = [];

	let myTicket;

	for (const line of lines) {
		switch (line) {
			case '':
				continue;
			case 'your ticket:':
			case 'nearby tickets:':
				section = line;
				continue;
		}

		if (section === 'rules') {
			const match = line.match(/^(.*?): (\d+-\d+) or (\d+-\d+)$/);

			if (!match) {
				throw new Error(`failed to parse line ${line}`);
			}
	
			const field = match[1];
			const rule1 = match[2].split('-').map(s => parseInt(s));
			const rule2 = match[3].split('-').map(s => parseInt(s));
	
			rules[field] = [rule1, rule2];
		} else if (section === 'your ticket:') {
			myTicket = line.split(',').map(s => parseInt(s));
		} else {
			tickets.push(line.split(',').map(s => parseInt(s)));
		}
	}


	const validTickets = [];

	for (const ticket of tickets) {
		const invalidValue = ticket.find(value => {
			let foundRule = false;

			rules:
			for (const field in rules) {
				for (const [from, to] of rules[field]) {
					if (value >= from && value <= to) {
						foundRule = true;
						break rules;
					}
				}
			}

			return !foundRule;
		});

		if (typeof invalidValue === 'undefined') {
			validTickets.push(ticket);
		}
	}

	const fields = validTickets[0].map(f => Object.keys(rules));
	
	for (const ticket of validTickets) {
		for (let i = 0; i < ticket.length; i++) {
			fields[i] = fields[i].filter(rule => {
				let matching = false;

				for (const [from, to] of rules[rule]) {
					if (ticket[i] >= from && ticket[i] <= to) {
						matching = true;
						break;
					}
				}

				return matching;
			});
		}
	}

	while (true) {
		const withSingleValue = fields.filter(fields => fields.length === 1);

		let repeatCleaning = false;

		for (const el of withSingleValue) {
			const value = el[0];

			for (let i = 0; i < fields.length; i++) {
				if (!fields[i].includes(value) || fields[i].length === 1) {
					continue;
				}

				fields[i] = fields[i].filter(el => el !== value);

				repeatCleaning = true;
			}
		}

		if (!repeatCleaning) {
			break;
		}
	}

	const myTicketValues = {};

	for (let i = 0; i < fields.length; i++) {
		myTicketValues[fields[i][0]] = myTicket[i];
	}

	let res = 1;

	for (const field in myTicketValues) {
		if (field.startsWith('departure')) {
			res *= myTicketValues[field];
		}
	}

	console.log(res);
}

main();