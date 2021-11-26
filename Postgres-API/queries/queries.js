const queries = {
    users: {
        // Get user(s) given parameters
        // () No paramters = get all users
        // (str) One string paramter = get user with that parameter
        // ([]) Array of parameters = get user with all the given parameters
        get: (params) => {
            if (!params) {
                return 'SELECT * FROM users';
            }
            return `SELECT * FROM users WHERE ${formatParams(params)}`;
        },
        // Create a user
        post: 'INSERT INTO users (email, username, dob, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5, $6)',
        // Update a user
        // Pass the user id after all the other parameters in the same array
        put: (params) => {
            return `UPDATE users SET ${formatParams(params)} WHERE id = $${params.length+1}`;
        },
        // Delete a user
        delete: 'DELETE FROM users WHERE id = $1',
        follow: '',
        unfollow: ''
    },
    posts: {},
    comments: {},
    connections: {
        get: 'SELECT * FROM connections WHERE (user_a_id = $1 AND user_b_id = $2) OR (user_a_id = $2 AND user_b_id = $1)',
        getAB: 'SELECT * FROM connections WHERE user_a_id = $1 AND user_b_id = $2',
        post: 'INSERT INTO connections (user_a_id, user_b_id) VALUES ($1, $2)',
        followA: 'UPDATE connections SET b_following_a = $1 WHERE user_b_id = $2',
        followB: 'UPDATE connections SET a_following_b = $1 WHERE user_a_id = $2'
    },
    likeness: {}
};

// Convert an array of parameters into a string
// Ex: ('id', 'username', 'password') => 'id = $1, username = $2, password = $3'
const formatParams = (params) => {
    let selection = '';
    if (typeof params === 'object') {
        for(let i = 0; i < params.length; i++){
            if(i !== 0)  selection += ', ';
            selection += params[i] + ' = $' + (i + 1);
        }
    }
    else {
        selection = `${params} = $1`;
    }
    return selection;
}

module.exports = queries;

