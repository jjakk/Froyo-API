const pool = require('../db');
const queries = require('../queries/queries');

// Middleware to get the comments of parent content (post or comment)
const getComments = async (req, res) => {
    try {
        const { id: parentId } = req.params;
        const { rows: comments } = await pool.query(queries.comments.getByParent, [parentId]);
        if (comments.length === 0) return res.status(404).send('No comments found');
        return res.status(200).send(comments);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = getComments;