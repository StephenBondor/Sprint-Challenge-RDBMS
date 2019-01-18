const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile.js');
const morgan = require('morgan')
// const dbAccess = require('./helpers.js');

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
	db(table)
		.where({id})
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
