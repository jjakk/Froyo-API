const { Router } = require('express');
const queries = require('../../queries/queries');
const pool = require('../../db');
// Require Auth
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

// GET all of the current user's posts
router.get('/', requireAuth, async (req, res) => {
    try {
        const { rows: posts } = await pool.query(queries.posts.getByAuthor, [req.user.id]);
        if (posts.length === 0) return res.status(404).send('No posts found');
        return res.status(200).send(posts);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// GET a specific post by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows: [ post ] } = await pool.query(queries.posts.get, [id]);
        if (!post) return res.status(404).send('Post not found');
        return res.status(200).send(post);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// Create (POST) a new post
router.post('/', requireAuth, async (req, res) => {
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
        return res.status(500).send(err);
    }
});

// Update (PUT) a post by ID
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            text,
            image_url
        } = req.body;
    
        // Confirm that text isn't empty
        if (!text) return res.status(400).send('Must provide text body');

        // Check that the post exists in the database
        const { rows: [ post ] } = await pool.query(queries.posts.get, [id]);
        if (!post) return res.status(404).send('Post not found');

        // Make sure that it's the user's own post that their deleting
        if (post.id !== id) return res.status(403).send('You can only update your own posts');
    
        // Update the post
        await pool.query(queries.posts.put, [text, image_url, id]);
        return res.status(200).send('Post updated');
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

// DELETE a post by ID
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Check that the post exists in the database
        const { rows: [ post ] } = await pool.query(queries.posts.get, [id]);
        if (!post) return res.status(404).send('Post not found');

        // Make sure that it's the user's own post that their deleting
        if (post.id !== id) return res.status(403).send('You can only delete your own posts');
    
        // Delete the post
        await pool.query(queries.posts.delete, [id]);
        return res.status(200).send('Post deleted');
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

module.exports = router;