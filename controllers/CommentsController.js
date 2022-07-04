// CRUD operations for comments
const queryDB = require('../queries/queryDB');

const createComment = async (req, res) => {
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
    await queryDB('comments', 'post', { params: ['text', 'parent_id', 'author_id'] }, [text, parent_id, req.user.id]);
    return res.status(201).send('Comment created');
}

const updateComment = async (req, res) => {
    const { id: commentId } = req.params;
    const { text } = req.body;

    // Confirm that text isn't empty
    if (!text) return res.status(400).send('Must provide text body');

    // Check that the comment exists in the database
    const [ comment ] = await queryDB('comments', 'get', { where: ['id'] }, [commentId]);
    if (!comment) return res.status(404).send('Comment not found');

    // Make sure that the user is updating their own comment
    if (comment.author_id !== req.user.id) return res.status(403).send('You can only update your own comments');

    // Update the comment
    await queryDB('comments', 'put', { params: ['text'], where: ['id'] }, [text, commentId]);
    return res.status(201).send('Comment updated');
}

module.exports = {
    createComment,
    updateComment
};
