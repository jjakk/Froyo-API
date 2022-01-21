// Query the database given a table, method, and parameters
const pool = require('./db');
const formatQuery = require('./formatQuery');

// Query the database given table, method, conditions, and values
const query = async (table, method, conditions, values) => {
    const query = formatQuery(table, method, conditions);
    const { rows } = await pool.query(query, values);

    return rows;
}

// Queries different database tables depending on the input
const queryDB = async (table, method, conditions, values) => {
    return (
        table !== 'contents' ? (
            await query(table, method, conditions, values)
        ) : (
            (await query('posts', method, conditions, values)).concat(
                await query('comments', method, conditions, values)
            )
        )
    );
};

module.exports = queryDB;
