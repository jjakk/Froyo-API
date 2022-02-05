/*
This function delete all the images of a post
*/
const queryDB = require('../queryDB');
const { deleteFile } = require('../../aws/s3');

// Deletes all the comments of a parent content
const deleteImages = async (postId) => {
    const images = await queryDB('images', 'get', { where: ['post_id'] }, [postId]);
    if(images.length === 0) return;
    for (let i = 0; i < images.length; i++) {
        // Remove image from the database
        await queryDB('images', 'delete', { where: ['id'] }, [images[i].id]);
        // Delete the image from S3
        await deleteFile(images[i].bucket_key);
    }
};

module.exports = deleteImages;