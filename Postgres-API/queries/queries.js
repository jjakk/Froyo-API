const queries = {
    users: {
        get: 'SELECT * FROM users WHERE id = $1',
        getAll: 'SELECT * FROM users',
        post: 'INSERT INTO users (email, username, dob, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5, $6)',
        put: 'UPDATE users SET email = $1, username = $2, dob = $3, first_name = $4, last_name = $5, password = $6) WHERE id = $7',
        /*follow: '',
        unfollow: ''*/
    },
    posts: {},
    comments: {},
};

module.exports = queries;

