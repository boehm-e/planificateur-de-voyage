const bcrypt = require('bcrypt');
const passwd = bcrypt.hashSync('password', 10);

exports.up = function(knex) {
    /* create role table */
    return knex.schema.createTable('role', table => {
        table.increments().primary();
        table.string('authority', 100).unique().notNullable();
    })
    /* create USER and ADMIN roles */
    .then(_ => Promise.all([
        knex('role').insert({authority: 'USER'}),
        knex('role').insert({authority: 'ADMIN'})
    ]))
    /* create user table */
    .then(_ => knex.schema.createTable('user', table => {
        table.increments().primary();
        table.string('email', 100).unique().notNullable();
        table.string('password', 200).notNullable();
        table.integer('role_id').unsigned().notNullable().references('role.id').onDelete('CASCADE').defaultTo(1);
    }))
    .then(_ => Promise.all([
        knex('user').insert({email: 'test@gmail.com', password: passwd, role_id: 1}),
        knex('user').insert({email: 'erwan.boehm@gmail.com', password: passwd, role_id: 2})
    ]))
    /* create locations table */
    .then(_ => knex.schema.createTable('location', table => {
        table.increments().primary();
        table.text('name', 100).notNullable();
        table.decimal('latitude', 10, 8).notNullable();
        table.decimal('longitude', 10, 8).notNullable();
    }))
    /* create trip table */
    .then(_ => knex.schema.createTable('trip', table => {
        table.increments().primary();
        table.integer('user_id').unsigned().notNullable().references('user.id').onDelete('CASCADE');
        table.string('name', 100).notNullable();
        table.dateTime('start_date').notNullable();
        table.dateTime('end_date').notNullable();
        table.string('image_preview');
    }))
    /* create group table */
    .then(_ => knex.schema.createTable('event', table => {
        table.increments().primary();
        table.enu('type', ['PLANE', 'BOAT', 'TRAIN', 'CAMPING', 'HOTEL']).notNullable();
        table.text('name', 100);
        table.dateTime('date').notNullable();
        table.integer('location_id').unsigned().notNullable().references('location.id').onDelete('CASCADE');
        table.integer('trip_id').unsigned().notNullable().references('trip.id').onDelete('CASCADE');
        table.integer('user_id').unsigned().notNullable().references('user.id').onDelete('CASCADE');
    }))
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('event')
        .dropTable('trip')
        .dropTable('location')
        .dropTable('user')
        .dropTable('role')

        // .then(_ =>
        //     knex.schema
        //         .dropTable('event')
        // )
};
