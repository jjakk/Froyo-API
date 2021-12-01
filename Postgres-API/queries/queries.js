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
        get: formatQuery({ table: 'posts', method: 'get', where: ['id'] }),
        // Get by author ID
        getByAuthor: formatQuery({ table: 'posts', method: 'get', where: ['author_id'] }),
        // Create a post
        post: formatQuery({ table: 'posts', method: 'post', params: ['text', 'image_url', 'author_id'] }),
        // Update a post
        put: formatQuery({ table: 'posts', method: 'put', params: ['text', 'image_url'], where: ['id'] }),
        // Delete a post (given post ID)
        delete: formatQuery({ table: 'posts', method: 'delete', where: ['id'] }),
        // Delete a post given author ID
        deleteByAuthor: formatQuery({ table: 'posts', method: 'delete', where: ['author_id'] })
    },
    comments: {
        // Get by Comment ID
        get: formatQuery({ table: 'comments', method: 'get', where: ['id'] }),
        // Get by Author ID
        getByAuthor: formatQuery({ table: 'comments', method: 'get', where: ['author_id'] }),
        // Get all the comments for a given parent
        getByParent: formatQuery({ table: 'comments', method: 'get', where: ['parent_id'] }),
        // Crate a comment
        post: formatQuery({ table: 'comments', method: 'post', params: ['text', 'parent_id', 'author_id'] }),
        // Update a comment by ID
        put: formatQuery({ table: 'comments', method: 'put', params: ['text'], where: ['id'] }),
        // Delete a comment by ID
        delete: formatQuery({ table: 'comments', method: 'delete', where: ['id'] })
    },
    connections: {
        // Get a connection given two user IDs (not in any particular order)
        get: 'SELECT * FROM connections WHERE (user_a_id = $1 AND user_b_id = $2) OR (user_a_id = $2 AND user_b_id = $1)',
        // Get a connection given user_a_id and user_b_id in that particular order
        getAB: formatQuery({ table: 'connections', method: 'get', where: ['user_a_id', 'user_b_id'] }),
        // Creata a new connection given two user IDs
        post: formatQuery({ table: 'connections', method: 'post', params: ['user_a_id', 'user_b_id'] }),
        // Set b_following_a
        followA: formatQuery({ table: 'connections', method: 'put', params: ['b_following_a'], where: ['id'] }),
        // set a_following_b
        followB: formatQuery({ table: 'connections', method: 'put', params: ['a_following_b'], where: ['id'] }),
        // Delete a connection given one user ID
        delete: formatQuery({ table: 'connections', method: 'delete', where: ['user_a_id', 'user_b_id'] })
    },
    likeness: {
        // Get a likeness given a user ID, a content ID, and like_content value (1 = like, 0 = dislike)
        get: formatQuery({ table: 'likeness', method: 'get', where: ['user_id', 'content_id'] }),
        // Create a new likeness given a user ID, a content ID, and like_content value
        post: formatQuery({ table: 'likeness', method: 'post', params: ['user_id', 'content_id', 'like_content'] }),
        // Update a likeness given a like_content value, user ID, and a content ID,
        put: 'UPDATE likeness SET like_content = $3 WHERE user_id = $1 AND content_id = $2',
        // Delete a likeness given a user ID and a content ID
        delete: formatQuery({ table: 'likeness', method: 'delete', where: ['user_id', 'content_id'] })
    }
};


module.exports = queries;

