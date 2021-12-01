const formatQuery = require('./formatQuery');

const queries = {
    users: {
        // Get all users
        getAll: formatQuery({ table: 'users', method: 'get' }),
        // Get user by ID
        getById: formatQuery({ table: 'users', method: 'get', where: ['id'] }),
        // Get user by email
        getByEmail: formatQuery({ table: 'users', method: 'get', where: ['email'] }),
        // Get user by username
        getByUsername: formatQuery({ table: 'users', method: 'get', where: ['username'] }),
        // Create a user
        post: formatQuery({
            table: 'users',
            method: 'post',
            params: ['email', 'username', 'dob', 'first_name', 'last_name', 'password'],
        }),
        // Update a user
        put: formatQuery({
            table: 'users',
            method: 'put',
            params: ['email', 'username', 'dob', 'first_name', 'last_name', 'password', 'changed_email'],
            where: ['id'],
        }),
        // Delete a user
        delete: formatQuery({ table: 'users', method: 'delete', where: ['id'] })
    },
    posts: {
        // Get by post ID
        get: 'SELECT * FROM posts WHERE id = $1',
        // Get by author ID
        getByAuthor: 'SELECT * FROM posts WHERE author_id = $1',
        // Create a post
        post: 'INSERT INTO posts (text, image_url, author_id) VALUES ($1, $2, $3)',
        // Update a post
        put: 'UPDATE posts SET text = $1, image_url = $2 WHERE id = $3',
        // Delete a post
        delete: 'DELETE FROM posts WHERE id = $1',
        // Delete a post give author ID
        deleteByAuthor: 'DELETE FROM posts WHERE author_id = $1'
    },
    comments: {
        // Get by Comment ID
        get: 'SELECT * FROM comments WHERE id = $1',
        // Get by Author ID
        getByAuthor: 'SELECT * FROM comments WHERE author_id = $1',
        // Get all the comments for a given parent
        getByParent: 'SELECT * FROM comments WHERE parent_id = $1',
        // Crate a comment
        post: 'INSERT INTO comments (text, parent_id, author_id) VALUES ($1, $2, $3)',
        // Update a comment by ID
        put: 'UPDATE comments SET text = $1 WHERE id = $2',
        // Delete a comment by ID
        delete: 'DELETE FROM comments WHERE id = $1'
    },
    connections: {
        // Get a connection given two user IDs (not in any particular order)
        get: 'SELECT * FROM connections WHERE (user_a_id = $1 AND user_b_id = $2) OR (user_a_id = $2 AND user_b_id = $1)',
        // Get a connection given user_a_id and user_b_id in that particular order
        getAB: 'SELECT * FROM connections WHERE user_a_id = $1 AND user_b_id = $2',
        // Creata a new connection given two user IDs
        post: 'INSERT INTO connections (user_a_id, user_b_id) VALUES ($1, $2)',
        // Set b_following_a
        followA: 'UPDATE connections SET b_following_a = $1 WHERE id = $2',
        // set a_following_b
        followB: 'UPDATE connections SET a_following_b = $1 WHERE id = $2',
        // Delete a connection given one user ID
        delete: 'DELETE FROM connections WHERE user_a_id = $1 OR user_b_id = $1'
    },
    likeness: {
        // Get a likeness given a user ID, a content ID, and like_content value (1 = like, 0 = dislike)
        get: 'SELECT * FROM likeness WHERE user_id = $1 AND content_id = $2',
        // Create a new likeness given a user ID, a content ID, and like_content value
        post: 'INSERT INTO likeness (user_id, content_id, like_content) VALUES ($1, $2, $3)',
        // Update a likeness given a like_content value, user ID, and a content ID,
        put: 'UPDATE likeness SET like_content = $3 WHERE user_id = $1 AND content_id = $2',
        // Delete a likeness given a user ID and a content ID
        delete: 'DELETE FROM likeness WHERE user_id = $1 AND content_id = $2'
    }
};


module.exports = queries;

