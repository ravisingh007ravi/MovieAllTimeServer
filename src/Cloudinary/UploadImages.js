const cloudinary = require('cloudinary').v2;
require('dotenv').config();



exports.ImgUrl = async (img) => {

    cloudinary.config({
        cloud_name: process.env.Cloudname,
        api_key: process.env.ApiKey,
        api_secret: process.env.APISecrect
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(img)
            .catch((error) => {
                console.log(error);
            });
        return uploadResult
    }
    catch (e) {
        console.log(e)
    }
}