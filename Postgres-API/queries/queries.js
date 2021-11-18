const queries = {
    users: {
        // Get user(s) given parameters
        // () No paramters = get all users
        // (str) One string paramter = get user with that parameter
        // ([]) Array of parameters = get user with all the given parameters
        get: (params) => {
            let selection = '';
            if (!params) {
                return 'SELECT * FROM users';
            }
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
        // Create a user
        post: 'INSERT INTO users (id, email, username, dob, first_name, last_name, password) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6)',
        put: 'UPDATE users SET email = $1, username = $2, dob = $3, first_name = $4, last_name = $5, password = $6 WHERE id = $7',
        /*follow: '',
        unfollow: ''*/
    },
    posts: {},
    comments: {},
};

module.exports = queries;

