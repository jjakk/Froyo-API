// CRUD operations for posts
const queries = require('../queries/queries');
const pool = require('../db');

// Create (POST) a new post
const post = async (req, res) => {
    try {
        const {
            text,
            image_url
        } = req.body;
    
        // Confirm that text isn't empty
        if (!text) return res.status(400).send('Must provide text body');
    
        // Create the new post
        await pool.query(queries.posts.post, [text, image_url, req.user.id]);
        return res.status(201).send('Post created');
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

// Update (PUT) a post by ID
const put = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const {
            text,
            image_url
        } = req.body;
    
        // Confirm that text isn't empty
        if (!text) return res.status(400).send('Must provide text body');

        // Check that the post exists in the database
        const { rows: [ post ] } = await pool.query(queries.posts.get, [postId]);
        if (!post) return res.status(404).send('Post not found');

        // Make sure that it's the user's own post that their deleting
        if (post.author_id !== req.user.id) return res.status(403).send('You can only update your own posts');
    
        // Update the post
        await pool.query(queries.posts.put, [text, image_url, postId]);
        return res.status(200).send('Post updated');
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

module.exports = {
    post,
    put
};