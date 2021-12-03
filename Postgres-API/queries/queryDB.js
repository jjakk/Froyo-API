// Query the database given a table, method, and parameters
const pool = require('../db');
const formatQuery = require('./formatQuery');

const queryDB = async (table, method, conditions, data) => {
    const query = formatQuery(table, method, conditions);
    const { rows } = await pool.query(query, data);
    return rows;
}

module.exports = queryDB;
