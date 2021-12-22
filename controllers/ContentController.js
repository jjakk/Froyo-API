// Controller for both types of content (post & comment)
const queryDB = require('../queries/queryDB');
// helpers
const { capitalize } = require('../helpers/helpers');
const deleteComments = require('../helpers/resursiveDeletion/deleteComments');

// GET all the comments of either a post or a comment
const getComments = async (req, res) => {
    try {
        const { id: parentId } = req.params;
        const comments = await queryDB('comments', 'get', { where: ['parent_id'] }, [parentId]);
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
        const [ content ] = (
            type ? (
                await queryDB(type, 'get', { where: ['id'] }, [contentId])
            ) : (
                await queryDB('posts', 'get', { where: ['id'] }, [contentId])
                ||
                await queryDB('comments', 'get', { where: ['id'] }, [contentId])
            )
        );
        if (!content) return res.status(404).send(`${typeName} not found`);

        // Get whether the current user likes the content
        const [ liking ] = await queryDB('likeness', 'get',
            { where: ['user_id', 'content_id', 'like_content'] },
            [req.user.id, contentId, true]
        );

        // Get whether the current user dislikes the content
        const [ disliking ] = await queryDB('likeness', 'get',
            { where: ['user_id', 'content_id', 'like_content'] },
            [req.user.id, contentId, false]
        );

        // Append like/dislike status to returned content
        const result = {
            ...content,
            liking: !!liking,
            disliking: !!disliking
        };

        return res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

// Get all a user's posts or comments
const getAll = async (req, res) => {
    try {
        const type = req.targetResource;
        let contents = (
            type ? (
                await queryDB(type, 'get', { where: ['author_id'] }, [req.user.id])
            ) : (
                (await queryDB('posts', 'get', { where: ['author_id'] }, [req.user.id])).concat(
                    await queryDB('comments', 'get', { where: ['author_id'] }, [req.user.id])
                )
            )
        );

        // Add liking and disliking status of current user to contents
        for(let i = 0; i < contents.length; i++){
            const [ liking ] = await queryDB('likeness', 'get',
                { where: ['user_id', 'content_id', 'like_content'] },
                [req.user.id, contents[i].id, true]
            );

            // Get whether the current user dislikes the content
            const [ disliking ] = await queryDB('likeness', 'get',
                { where: ['user_id', 'content_id', 'like_content'] },
                [req.user.id, contents[i].id, false]
            );

            // Append like/dislike status to returned content
            contents[i] = {
                ...contents[i],
                liking: !!liking,
                disliking: !!disliking
            };
        }

        return res.status(200).send(contents);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

// Delete a post or comment by ID
const deleteContent = async (req, res) => {
    try {
        const type = req.targetResource;
        const typeName = type ? capitalize(type.slice(0, -1)) : null;

        const { id: contentId } = req.params;

        // Check that the content exists in the database
        const [ content ] = (
            type ? (
                await queryDB(type, 'get', { where: ['id'] }, [contentId])
            ) : (
                await queryDB('posts', 'get', { where: ['id'] }, [contentId])
                ||
                await queryDB('comments', 'get', { where: ['id'] }, [contentId])
            )
        );
        if (!content) return res.status(404).send(`${typeName || 'Content'} not found`);

        // Make sure that it's the user's own content that their deleting
        if (content.author_id !== req.user.id) return res.status(403).send(`You can only delete your own ${type}`);

        // Delete all the content's comments recursively
        await deleteComments(contentId);

        // Delete all the content's likeness
        await queryDB('likeness', 'delete', { where: ['content_id'] }, [contentId]);
    
        // Delete the content itself
        if (type) {
            await queryDB(type, 'delete', { where: ['id'] }, [contentId])
        }
        else {
            await queryDB('posts', 'delete', { where: ['id'] }, [contentId])
            await queryDB('comments', 'delete', { where: ['id'] }, [contentId])
        }
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
        const [ content ] = type ? (
            await queryDB(type, 'get', { where: ['id'] }, [contentId])
        ) : (
            await queryDB('posts', 'get', { where: ['id'] }, [contentId])
            ||
            await queryDB('comments', 'get', { where: ['id'] }, [contentId])
        );
        if (!content) return res.status(404).send(`${typeName} not found`);
        
        // Check if a likeness already exists. If not, create one
        const [ likeness ] = await queryDB('likeness', 'get', { where: ['user_id', 'content_id'] }, [req.user.id, contentId]);
        if (!likeness) {
            await queryDB('likeness', 'post', { params: ['user_id', 'content_id', 'like_content'] }, [req.user.id, contentId, true]);
            return res.status(201).send(`${typeName} liked`);
        }
        else {
            // User already likes the content -> unlike it (delete likeness)
            if (likeness.like_content) {
                await queryDB('likeness', 'delete', { where: ['user_id', 'content_id'] }, [req.user.id, contentId]);
                return res.status(200).send(`${typeName} unliked`);  
            }
            // User currently dislikes the post -> change to like
            await queryDB('likeness', 'put', { params: ['like_content'], where: ['user_id', 'content_id'] }, [true, req.user.id, contentId]);
            return res.status(200).send(`${typeName} liked`);
        }
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

// Dslike (PUT) a post or comment by ID
const dislike = async (req, res) => {
    try {
        const type = req.targetResource;
        const { id: contentId } = req.params;
        const typeName = type ? capitalize(type.slice(0, -1)) : 'Content';

        // Check that the content exists in the database
        const [ content ] = type ? (
            await queryDB(type, 'get', { where: ['id'] }, [contentId])
        ) : (
            await queryDB('posts', 'get', { where: ['id'] }, [contentId])
            ||
            await queryDB('comments', 'get', { where: ['id'] }, [contentId])
        );
        if (!content) return res.status(404).send(`${typeName} not found`);
        
        // Check if a likeness already exists. If not, create one
        const [ likeness ] = await queryDB('likeness', 'get', { where: ['user_id', 'content_id'] }, [req.user.id, contentId]);
        if (!likeness) {
            await queryDB('likeness', 'post', { params: ['user_id', 'content_id', 'like_content']}, [req.user.id, contentId, false]);
            return res.status(201).send(`${typeName} disliked`);
        }
        else {
            // User currently likes the content -> dislike it
            if (likeness.like_content) {
                await queryDB('likeness', 'put', { params: ['like_content'], where: ['user_id', 'content_id'] }, [false, req.user.id, contentId]);
                return res.status(200).send(`${typeName} disliked`);
            }
            // User already dislikes the post -> undislike it
            await queryDB('likeness', 'delete', { where: ['user_id', 'content_id'] }, [req.user.id, contentId]);
            return res.status(200).send(`${typeName} undisliked`);
        }
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

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
        const likes  = await queryDB('likeness', 'get', { where: ['content_id', 'like_content'] }, [contentId, true]);
        res.status(200).send(likes.length+'');
        
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

// Get the number of dislikes for a post or comment by ID
const getDislikes = async (req, res) => {
    try {
        const { id: contentId } = req.params;

        // Get all dislikes from the database with the given content ID
        const dislikes = await queryDB('likeness', 'get', { where: ['content_id', 'like_content'] }, [contentId, false]);
        res.status(200).send(dislikes.length+'');
        
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

module.exports = {
    getComments,
    getAll,
    getById,
    deleteContent,
    like,
    dislike,
    liking,
    disliking,
    getLikes,
    getDislikes
};