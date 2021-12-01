const queries = require('../queries/queries');
const pool = require('../db');
const getComments = require('../getComments');

// GET all of the current user's posts
const getAll = async (req, res) => {
    try {
        const { rows: posts } = await pool.query(queries.posts.getByAuthor, [req.user.id]);
        if (posts.length === 0) return res.status(404).send('No posts found');
        return res.status(200).send(posts);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

// GET a specific post by ID
const getById = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const { rows: [ post ] } = await pool.query(queries.posts.get, [postId]);
        if (!post) return res.status(404).send('Post not found');
        return res.status(200).send(post);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

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

// DELETE a post by ID
const deletePost = async (req, res) => {
    try {
        const { id: postId } = req.params;

        // Check that the post exists in the database
        const { rows: [ post ] } = await pool.query(queries.posts.get, [postId]);
        if (!post) return res.status(404).send('Post not found');

        // Make sure that it's the user's own post that their deleting
        if (post.author_id !== req.user.id) return res.status(403).send('You can only delete your own posts');
    
        // Delete the post
        await pool.query(queries.posts.delete, [postId]);
        return res.status(200).send('Post deleted');
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

// Like (PUT) a post by ID
const like = async (req, res) => {
    try {
        const { id: postId } = req.params;

        // Check that the post exists in the database
        const { rows: [ post ] } = await pool.query(queries.posts.get, [postId]);
        if (!post) return res.status(404).send('Post not found');
        
        // Check if a likeness already exists. If not, create one
        const { rows: [ likeness ] } = await pool.query(queries.likeness.get, [req.user.id, postId]);
        if (!likeness) {
            await pool.query(queries.likeness.post, [req.user.id, postId, true]);
            return res.status(201).send('Post liked');
        }
        else {
            // User already likes the post -> unlike it (delete likeness)
            if (likeness.like_content) {
                await pool.query(queries.likeness.delete, [req.user.id, postId]);
                return res.status(200).send('Post unliked');  
            }
            // User currently dislikes the post -> change to like
            await pool.query(queries.likeness.put, [req.user.id, postId, true]);
            return res.status(200).send('Post liked');
        }
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

// Dslike (PUT) a post by ID
const dislike = async (req, res) => {
    try {
        const { id: postId } = req.params;

        // Check that the post exists in the database
        const { rows: [ post ] } = await pool.query(queries.posts.get, [postId]);
        if (!post) return res.status(404).send('Post not found');
        
        // Check if a likeness already exists. If not, create one
        const { rows: [ likeness ] } = await pool.query(queries.likeness.get, [req.user.id, postId]);
        if (!likeness) {
            await pool.query(queries.likeness.post, [req.user.id, postId, false]);
            return res.status(201).send('Post disliked');
        }
        else {
            // User currently likes the post -> dislike it
            if (likeness.like_content) {
                await pool.query(queries.likeness.put, [req.user.id, postId, false]);
                return res.status(200).send('Post disliked');
            }
            // User already dislikes the post -> undislike it
            await pool.query(queries.likeness.delete, [req.user.id, postId]);
            return res.status(200).send('Post undisliked');
        }
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

module.exports = {
    getAll,
    getById,
    getComments,
    post,
    put,
    deletePost,
    like,
    dislike
};