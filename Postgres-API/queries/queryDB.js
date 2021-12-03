// Query the database given a table, method, and parameters
const pool = require('../db');

const queryDB = async (table, method, data, info) => {
    const query = formatQuery(table, method, data);
    const { rows } = await pool.query(query, info);
    return rows;
}

module.exports = queryDB;
