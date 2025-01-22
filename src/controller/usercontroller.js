const userModel = require("../Models/userModel.js")
const { validName, validEmail, validPassword } = require('../Validation/AllValidation.js');
const { ImgUrl } = require('../Cloudinary/UploadImages.js');
const bcrypt = require('bcrypt');



exports.createUser = async (req, res) => {
    try {
        const data = req.body;
        const img = req.file;

        const { name, email, password, title } = data;

        const checkEmail = await userModel.findOne({ email: email });
        if (checkEmail) 
            return res.status(422).send({ status: false, msg: "Email already exists", data: checkEmail._id });

      
        if (img) {
            const urlPath = img.path;
            const urlResult = await ImgUrl(urlPath);
            data.profileImg = urlResult.secure_url;
        }

        const bcryptPass = await bcrypt.hash(password, 10); 
        data.password = bcryptPass;

        data.otp = Math.floor(1000 + Math.random() * 9000);
        data.role = 'user';

        const userDB = await userModel.create(data);
        res.status(201).send({ status: true, msg: "User created successfully", data: userDB });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


