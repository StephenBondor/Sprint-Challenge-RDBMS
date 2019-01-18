const knex = require('knex');
const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);

module.exports = {
	getProject: id => {
		const project = db('projects')
			.select('id', 'name', 'description', 'completed')
			.where({id})
			.first()
			// .then(results => console.log(results))
			// .catch();

		const actions = db('actions')
			.select('id', 'description', 'note', 'completed')
			.where({project_id: id})
			// .then(results => console.log(results))
			// .catch();

		return Promise.all([project, actions]).then(results => {
			let [project, actions] = results;
			return {
				id: project.id,
				name: project.name,
				description: project.description,
				completed: project.completed === 0 ? false : true,
				actions: actions
			};
		});
	}
};
