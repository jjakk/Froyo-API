const formatQuery = require('./formatQuery');

const queries = {
/*    users: {
        // Get all users
        getAll: formatQuery('users', 'get', []),
        // Get user by ID
        getById: formatQuery('users', 'get', ['id']),
        // Get user by email
        getByEmail: formatQuery('users', 'get', ['email']),
        // Get user by username
        getByUsername: formatQuery('users', 'get', ['username']),
        // Create a user
        post: formatQuery('users', 'post',
            ['email', 'username', 'dob', 'first_name', 'last_name', 'password'],
        ),
        // Update a user
        put: formatQuery('users', 'put', 
            ['email', 'username', 'dob', 'first_name', 'last_name', 'password', 'changed_email'],
            ['id'],
        ),
        // Delete a user
        delete: formatQuery('users', 'delete', ['id'])
    },
    posts: {
        // Get by post ID
        get: formatQuery('posts', 'get', ['id']),
        // Get by author ID
        getByAuthor: formatQuery('posts', 'get', ['author_id']),
        // Create a post
        post: formatQuery('posts', 'post', ['text', 'image_url', 'author_id']),
        // Update a post
        put: formatQuery('posts', 'put', ['text', 'image_url'], ['id']),
        // Delete a post (given post ID)
        delete: formatQuery('posts', 'delete', ['id']),
        // Delete a post given author ID
        deleteByAuthor: formatQuery('posts', 'delete', ['author_id'])
    },
    comments: {
        // Get by Comment ID
        get: formatQuery('comments', 'get', ['id']),
        // Get by Author ID
        getByAuthor: formatQuery('comments', 'get', ['author_id']),
        // Get all the comments for a given parent
        getByParent: formatQuery('comments', 'get', ['parent_id']),
        // Crate a comment
        post: formatQuery('comments', 'post', ['text', 'parent_id', 'author_id']),
        // Update a comment by ID
        put: formatQuery('comments', 'put', ['text'], ['id']),
        // Delete a comment by ID
        delete: formatQuery('comments', 'delete', ['id']),
        // Delete a comment given it's author ID
        deleteByAuthor: formatQuery('comments', 'delete', ['author_id']),
        // Delete a comment given it's parent ID
        deleteByParent: formatQuery('comments', 'delete', ['parent_id'])
    },
    connections: {
        // Get a connection given two user IDs (not in any particular order)
        get: 'SELECT * FROM connections WHERE (user_a_id = $1 AND user_b_id = $2) OR (user_a_id = $2 AND user_b_id = $1)',
        // Get a connection given user_a_id and user_b_id in that particular order
        getAB: formatQuery('connections', 'get', ['user_a_id', 'user_b_id']),
        // Creata a new connection given two user IDs
        post: formatQuery('connections', 'post', ['user_a_id', 'user_b_id']),
        // Set b_following_a
        followA: formatQuery('connections', 'put', ['b_following_a'], ['id']),
        // set a_following_b
        followB: formatQuery('connections', 'put', ['a_following_b'], ['id']),
        // Delete a connection given two user IDs
        delete: formatQuery('connections', 'delete', ['user_a_id', 'user_b_id']),
        // Delete connections given one user ID
        deleteWithOne: 'DELETE FROM connections WHERE user_a_id = $1 OR user_b_id = $1'
    },
    likeness: {
        // Get a likeness given a user ID, a content ID, and like_content value (1 = like, 0 = dislike)
        get: formatQuery('likeness', 'get', ['user_id', 'content_id']),
        // Get all the likeness given content ID and like_content value
        getByContent: formatQuery('likeness', 'get', ['content_id', 'like_content']),
        // Create a new likeness given a user ID, a content ID, and like_content value
        post: formatQuery('likeness', 'post', ['user_id', 'content_id', 'like_content']),
        // Update a likeness given a like_content value, user ID, and a content ID,
        put: formatQuery('likeness', 'put', ['like_content'], ['user_id', 'content_id']),
        // Delete a likeness given a user ID and a content ID
        delete: formatQuery('likeness', 'delete', ['user_id', 'content_id']),
        // Delete all the likeness given a user ID
        deleteByUser: formatQuery('likeness', 'delete', ['user_id'])
    }*/
};


module.exports = queries;

