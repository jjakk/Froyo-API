const queries = {
    users: {
        // Get user by a single string parameter or array of parameters
        getBy: (params='id') => {
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
            return `SELECT * FROM users WHERE ${selection}`;
        },
        // Get all users
        getAll: 'SELECT * FROM users',
        // Create a user
        post: 'INSERT INTO users (email, username, dob, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5, $6)',
        put: 'UPDATE users SET email = $1, username = $2, dob = $3, first_name = $4, last_name = $5, password = $6) WHERE id = $7',
        /*follow: '',
        unfollow: ''*/
    },
    posts: {},
    comments: {},
};

module.exports = queries;

