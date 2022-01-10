const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.RDS_USERNAME,
    database: process.env.RDS_DB_NAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.log('Error acquiring client');
    }
})

module.exports = pool;