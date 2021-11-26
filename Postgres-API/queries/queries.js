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
        delete: 'DELETE FROM users WHERE id = $1'
        /*follow: '',
        unfollow: ''*/
    },
    posts: {},
    comments: {},
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

