// CRUD operations for comments
const queries = require('../queries/queries');
const pool = require('../db');

// POST a new comment
const post = async (req, res) => {
    try {
        const {
            text,
            parent_id
        } = req.body;

        // Confirm that all the required fields are present
        switch (undefined) {
            case text:
                return res.status(400).send('Must provide text body');
            case parent_id:
                return res.status(400).send('Must provide parent ID');
        }

        // Create the new comment
        await pool.query(queries.comments.post, [text, parent_id, req.user.id]);
        return res.status(201).send('Comment created');
    }
    catch (err) {
        res.status(550).send(err.message);
    }
}

// Update (PUT) a comment by ID
const put = async (req, res) => {
    try{
        const { id: commentId } = req.params;
        const { text } = req.body;

        // Confirm that text isn't empty
        if (!text) return res.status(400).send('Must provide text body');

        // Check that the comment exists in the database
        const { rows: [ comment ] } = await pool.query(queries.comments.get, [commentId]);
        if (!comment) return res.status(404).send('Comment not found');

        // Make sure that the user is updating their own comment
        if (comment.author_id !== req.user.id) return res.status(403).send('You can only update your own comments');

        // Update the comment
        await pool.query(queries.comments.put, [text, commentId]);
        return res.status(201).send('Comment updated');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    post,
    put
};
