module.exports = {
    development: {
        client: 'mysql',
        connection: {
            host:     process.env.DB_HOST || 'localhost',
            database: 'planning',
            user:     process.env.MYSQL_USER || 'planning',
            password: process.env.MYSQL_PASSWORD || 'planning'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
    production: {
        client: 'mysql',
        connection: {
            host:     process.env.DB_HOST || 'localhost',
            database: 'planning',
            user:     process.env.MYSQL_USER ||'planning',
            password: process.env.MYSQL_PASSWORD ||'planning'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
