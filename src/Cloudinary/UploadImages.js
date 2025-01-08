const cloudinary = require('cloudinary').v2;
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.Cloudname,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISecrect
});

exports.userProfileImg = async(img) => {

    const uploadResult = await cloudinary.uploader.upload(img)
        .catch((error) => {
            console.log(error);
        });

    const url = uploadResult.secure_url;

    return url;
}