// Controller for both types of content (post & comment)
const pool = require('../db');
const queries = require('../queries/queries');

// GET all the comments of either a post or a comment
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

// Get either a post or comment by ID
// Type is either 'post' or 'comment'
const getById = (type) => async (req, res) => {
    try {
        if (type !== 'posts' && type !== 'comments') throw new Error('Invalid type');
        const { id: contentId } = req.params;
        const { rows: [ content ] } = await pool.query(queries[type].get, [contentId]);
        if (!content) return res.status(404).send('Content not found');
        return res.status(200).send(content);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

const getAll = (type) => async (req, res) => {
    try {
        if (type !== 'posts' && type !== 'comments') throw new Error('Invalid type');
        const { rows: contents } = await pool.query(queries[type].getByAuthor, [req.user.id]);
        if (contents.length === 0) return res.status(404).send(`No ${type} found`);
        return res.status(200).send(contents);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    getComments,
    getAll,
    getById
};