// Controller for both types of content (post & comment)
const queryDB = require('../queries/queryDB');
const dynamicQueryDB = require('../queries/dynamicQueryDB');
// helpers
const { capitalize } = require('../helpers/helpers');
const {
    formatContent,
    formatContents
} = require('../helpers/resourceFormatting/formatContent');
const deleteComments = require('../helpers/resursiveDeletion/deleteComments');
const sortContents = require('../helpers/sorting/sortContents');
// GET all the comments of either a post or a comment
const getComments = async (req, res) => {
    try {
        const { id: parentId } = req.params;
        let comments = await queryDB('comments', 'get', { where: ['parent_id'] }, [parentId]);
        comments = await formatContents(req, res, comments);

        return res.status(200).send(comments);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

// Get either a post or comment by ID
const getById = async (req, res) => {
    try {
        const type = req.targetResource;
        const { id: contentId } = req.params;
        const typeName = type ? capitalize(type.slice(0, -1)) : 'Content';

        // Search both posts & comments if no type given
        let [ content ] = await dynamicQueryDB(type, 'get', { where: ['id'] }, [contentId]);
        if (!content) return res.status(404).send(`${typeName} not found`);

        content = await formatContent(req, res, content);

        return res.status(200).send(content);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

// Search posts & comments by query
const get = async (req, res) => {
    try {
        const type = req.targetResource;
        // Check that the user isn't searching for all posts
        if (req.query.text === '') return res.status(200).send([]);
        // Get query parameters & set their default values
        let queryParams = Object.keys(req.query);
        let queryValues = Object.values(req.query);
        let queryMethod = 'search';
        if (queryParams.indexOf('author_id') !== -1) {
            queryMethod = 'get';
        }
        if (queryParams.length === 0 && queryValues.length === 0) {
            queryParams = ['author_id'];
            queryValues = [req.user.id];
            queryMethod = 'get';
        }

        let contents = await dynamicQueryDB(type, queryMethod, { where: queryParams }, queryValues);
        // Format contents
        contents = await formatContents(req, res, contents);
        // Sort contents
        contents = sortContents(contents, 'new');

        return res.status(200).send(contents);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};


// Delete a post or comment by ID
const deleteContent = async (req, res) => {
    try {
        const type = req.targetResource;
        const typeName = type ? capitalize(type.slice(0, -1)) : null;

        const { id: contentId } = req.params;

        // Check that the content exists in the database
        const [ content ] = await dynamicQueryDB(type, 'get', { where: ['id'] }, [contentId]);
        if (!content) return res.status(404).send(`${typeName || 'Content'} not found`);

        // Make sure that it's the user's own content that their deleting
        if (content.author_id !== req.user.id) return res.status(403).send(`You can only delete your own ${type}`);

        // Delete all the content's comments recursively
        await deleteComments(contentId);

        // Delete all the content's likeness
        await queryDB('likeness', 'delete', { where: ['content_id'] }, [contentId]);
    
        // Delete the content itself
        await dynamicQueryDB(type, 'delete', { where: ['id'] }, [contentId]);
        return res.status(200).send(`${capitalize(typeName)} deleted`);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

// Like (PUT) a post or comment by ID
const like = async (req, res) => {
    try {
        const type = req.targetResource;
        const { id: contentId } = req.params;
        const typeName = type ? capitalize(type.slice(0, -1)) : 'Content';

        // Check that the content exists in the database
        const [ content ] = await dynamicQueryDB(type, 'get', { where: ['id'] }, [contentId]);
        if (!content) return res.status(404).send(`${typeName} not found`);
        
        // Check if a likeness already exists. If not, create one
        const [ likeness ] = await queryDB('likeness', 'get', { where: ['user_id', 'content_id'] }, [req.user.id, contentId]);
        if (!likeness) {
            await queryDB('likeness', 'post', { params: ['user_id', 'content_id', 'like_content'] }, [req.user.id, contentId, true]);
        }
        else {
            // User already likes the content -> unlike it (delete likeness)
            if (likeness.like_content) {
                await queryDB('likeness', 'delete', { where: ['user_id', 'content_id'] }, [req.user.id, contentId]);
            }
            // User currently dislikes the post -> change to like
            await queryDB('likeness', 'put', { params: ['like_content'], where: ['user_id', 'content_id'] }, [true, req.user.id, contentId]);
        }

        // Get and return updated content
        let [ updatedContent ] = await dynamicQueryDB(type, 'get', { where: ['id'] }, [contentId]);
        // Format content
        updatedContent = await formatContent(req, res, updatedContent);
        return res.status(200).send(updatedContent);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

// Dslike (PUT) a post or comment by ID
const dislike = async (req, res) => {
    try {
        const type = req.targetResource;
        const { id: contentId } = req.params;
        const typeName = type ? capitalize(type.slice(0, -1)) : 'Content';

        // Check that the content exists in the database
        const [ content ] = await dynamicQueryDB(type, 'get', { where: ['id'] }, [contentId]);
        if (!content) return res.status(404).send(`${typeName} not found`);
        
        // Check if a likeness already exists. If not, create one
        const [ likeness ] = await queryDB('likeness', 'get', { where: ['user_id', 'content_id'] }, [req.user.id, contentId]);
        if (!likeness) {
            await queryDB('likeness', 'post', { params: ['user_id', 'content_id', 'like_content']}, [req.user.id, contentId, false]);
        }
        else {
            // User currently likes the content -> dislike it
            if (likeness.like_content) {
                await queryDB('likeness', 'put', { params: ['like_content'], where: ['user_id', 'content_id'] }, [false, req.user.id, contentId]);
            }
            // User already dislikes the post -> undislike it
            await queryDB('likeness', 'delete', { where: ['user_id', 'content_id'] }, [req.user.id, contentId]);
        }

        // Get and return updated content
        let [ updatedContent ] = await dynamicQueryDB(type, 'get', { where: ['id'] }, [contentId]);
        // Format content
        updatedContent = await formatContent(req, res, updatedContent);
        return res.status(200).send(updatedContent);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

// GET if the current user likes a post or comment by ID
const liking = async (req, res) => {
    const { id: contentId } = req.params;
    const [ liking ] = await queryDB('likeness', 'get',
        { where: ['user_id', 'content_id', 'like_content'] },
        [req.user.id, contentId, true]
    );
    return res.status(200).send(!!liking);
};

// GET if the current user dislikes a post or comment by ID
const disliking = async (req, res) => {
    const { id: contentId } = req.params;
    const [ liking ] = await queryDB('likeness', 'get',
        { where: ['user_id', 'content_id', 'like_content'] },
        [req.user.id, contentId, false]
    );
    return res.status(200).send(!!liking);
};

// Get the number of likes for a post or comment by ID
const getLikes = async (req, res) => {
    try {
        const { id: contentId } = req.params;

        // Get all likes from the database with the given content ID
        let likes  = await queryDB('likeness', 'get', { where: ['content_id', 'like_content'] }, [contentId, true]);
        likes = likes.map(like => like.user_id);
        res.status(200).send(likes);
        
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

// Get the number of dislikes for a post or comment by ID
const getDislikes = async (req, res) => {
    try {
        const { id: contentId } = req.params;

        // Get all dislikes from the database with the given content ID
        let dislikes = await queryDB('likeness', 'get', { where: ['content_id', 'like_content'] }, [contentId, false]);
        dislikes = dislikes.map(dislike => dislike.user_id);
        res.status(200).send(dislikes);
        
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

module.exports = {
    get,
    getById,
    getComments,
    deleteContent,
    like,
    dislike,
    liking,
    disliking,
    getLikes,
    getDislikes
};