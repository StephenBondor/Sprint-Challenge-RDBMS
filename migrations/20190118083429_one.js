exports.up = function(knex, Promise) {
	return knex.schema
		.createTable('projects', tbl => {
			//primary key
			tbl.increments(); //defaults to a column named id, autoincrements

			//other feilds
			tbl.text('name', 128);
			tbl.text('description');
			tbl.bool('completed');

			// time stamps
			tbl.timestamps(true, true);

			//constraints
			tbl.unique('name', 'uq_project_name'); //makes name unique
		})
		.createTable('actions', tbl => {
			//primary key
			tbl.increments(); //defaults to a column named id, autoincrements

			//other feilds
			tbl.text('description');
			tbl.text('note');
			tbl.bool('completed');
			tbl.integer('project_id')
				.unsigned()
				.references('id')
				.inTable('projects');

			// time stamps
			tbl.timestamps(true, true);

			//constraints
			tbl.unique('description', 'uq_action_description'); //makes description unique
		});
};

exports.down = function(knex, Promise) {
    return knex.schema
		.dropTableIfExists('projects')
		.dropTableIfExists('actions')
};
