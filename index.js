const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile.js');
const morgan = require('morgan');
const dbAccess = require('./helpers.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan());

// conect to the database
const db = knex(knexConfig.development);

//sanity check
console.log('index.js running');

//endpoint sanity check
server.get('/', (req, res) => {
	res.send('api working');
});

// add whatever to whatever table
server.post('/api/:table', (req, res) => {
	const body = req.body;
	db(req.params.table)
		.insert(body)
		.then(ids => {
			res.status(201).json(ids);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

//list whatever by ID
server.get('/api/:table/:id', (req, res) => {
	const {id, table} = req.params;
	if (table === 'projects') {
		console.log('check pass');
		dbAccess
			.getProject(id)
			.then(thing => {
				console.log(thing);
				res.status(200).json(thing);
			})
			.catch(err => {
				console.log(err);
				res.status(500).json(err);
			});
	} else {
		db(table)
			.where({id})
			.then(thing => {
				res.status(200).json(thing);
			})
			.catch(err => res.status(500).json(err));
	}
});

//list the entire table
server.get('/api/:table', (req, res) => {
	db(req.params.table)
		.then(things => {
			res.status(200).json(things);
		})
		.catch(err => res.status(500).json(err));
});

// delete whatever
server.delete('/api/:table/:id', (req, res) => {
	const id = req.params.id;
	db(req.params.table)
		.where({id: id})
		.del()
		.then(thing => {
			res.status(200).json(thing);
		})
		.catch(err => res.status(500).json(err));
});

// update whatever
server.put('/api/:table/:id', (req, res) => {
	const id = req.params.id;
	db(req.params.table)
		.where({id: id})
		.update(req.body)
		.then(thing => {
			res.status(200).json(thing);
		})
		.catch(err => res.status(500).json(err));
});

//API Server status
const port = 3300;
server.listen(port, function() {
	console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
