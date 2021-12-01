// Controller for both types of content (post & comment)
const pool = require('../db');
const queries = require('../queries/queries');

// GET all the comments of some content
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

module.exports = {
    getComments
};