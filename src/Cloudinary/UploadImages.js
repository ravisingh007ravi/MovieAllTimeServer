const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
require('dotenv').config();


cloudinary.config({
    cloud_name: process.env.Cloudname,
    api_key: process.env.ApiKey,
    api_secret: process.env.APISecrect
});

exports.ImgUrl = async (img) => {

    try {
        const optimizedBuffer = await sharp(img)
            .resize(1080, 720, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80, mozjpeg: true }).toBuffer();

        const uploadResult = await cloudinary.uploader.upload(
            `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`,
            { resource_type: 'auto', quality: 'auto' });


        return uploadResult;
    } catch (error) {
        console.error('Error during image optimization or upload:', error);
        throw error;
    }
}