const queries = {
    connections: {
        // Get a connection given two user IDs (not in any particular order)
        get: 'SELECT * FROM connections WHERE (user_a_id = $1 AND user_b_id = $2) OR (user_a_id = $2 AND user_b_id = $1)',
        // Delete connections given one user ID
        deleteWithOne: 'DELETE FROM connections WHERE user_a_id = $1 OR user_b_id = $1'
    },
};


module.exports = queries;

