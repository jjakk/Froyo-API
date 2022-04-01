const { Pool } = require('pg');

const pool = new Pool(process.env.NODE_ENV === 'production' ? {
    user: process.env.RDS_USERNAME,
    host: process.env.RDS_HOSTNAME,
    database: process.env.RDS_DB_NAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
} : {
    user: 'postgres',
    host: 'localhost',
    database: 'froyo',
    password: '',
    port: 5432,
});

module.exports = pool;