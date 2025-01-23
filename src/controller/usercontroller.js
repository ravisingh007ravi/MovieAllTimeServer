const userModel = require("../Models/userModel.js")
const { ImgUrl } = require('../Cloudinary/UploadImages.js');
const { verifyOtp } = require('../Mail/sendMail.js');
const bcrypt = require('bcrypt');



exports.createUser = async (req, res) => {
    try {
        const data = req.body;
        const img = req.file;

        const { name, email, password, title } = data;

        const randonOtp = Math.floor(1000 + Math.random() * 9000);

        const checkEmail = await userModel.findOneAndUpdate({ email: email }, { $set: { otp: randonOtp } }, { new: true });

        if (checkEmail) {
            if ((checkEmail.isAccountActive) == false) return res.status(200).send({ status: false, msg: "Your Account is Blocked" });
            if ((checkEmail.isVerify) == true) return res.status(200).send({ status: false, msg: "Your Account is Verify pls LogIn" });

            verifyOtp(name, email, randonOtp);
            return res.status(200).send({ status: true, msg: "otp send successfully", id: checkEmail._id });
        }

        if (img) {
            const urlPath = img.path;
            const urlResult = await ImgUrl(urlPath);
            data.profileImg = urlResult.secure_url;
        }

        const bcryptPass = await bcrypt.hash(password, 10);
        data.password = bcryptPass;

        data.otp = randonOtp;
        data.role = 'user';
        verifyOtp(name, email, randonOtp);
        const userDB = await userModel.create(data);

        const DB = {
            profileImg: userDB.profileImg,
            title: userDB.title,
            name: userDB.name,
            email: userDB.email,
        }

        res.status(201).send({ status: true, msg: "User created successfully", data: DB, id: userDB._id });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


exports.userOTPVerify = async (req, res) => {
    try {
        const userid = req.params.id;
        const { otp } = req.body;

        if (!otp) return res.status(200).send({ status: true, msg: "pls Provide OTP" });

        const userDB = await userModel.findById({ _id: userid });

        if (!userDB) return res.status(200).send({ status: true, msg: "User not found" });

        if (!((userDB.otp) == otp)) return res.status(200).send({ status: true, msg: "Wrong otp" });

        await userModel.findByIdAndUpdate({ _id: userid }, { $set: { isVerify: true } }, { new: true });
        res.status(200).send({ status: true, msg: "User Verify successfully" });

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

exports.userLogIn = async (req, res) => {

    try { 

        const {email, password} = req.body;
        console.log(email, password)
    }

    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}