/*
This function uploads images to AWS, and stores
their keys on the database linked to their post
*/
const { uploadFile, unlinkFile } = require('./s3');
const queryDB = require('../queries/queryDB');

const uploadImages = async (images, post) => {
    for (let i = 0; i < images.length; i++) {
        // Get key each uploaded file
        const { Key } = await uploadFile(images[i]);

        // Create a new image in the database
        await queryDB('images', 'post', { params: ['post_id', 'bucket_key']}, [post.id, Key]);

        // Remove temporary file from uploads directory
        await unlinkFile(images[i].path);
    }
};

module.exports = uploadImages;