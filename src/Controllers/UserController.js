const userModel = require("../Models/userModel.js")
const { ImgUrl } = require('../Cloudinary/UploadImages.js');
const { verifyOtp, AdminAuthOTP } = require('../Mail/sendMail.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



exports.createUser = async (req, res) => {
    try {
        const data = req.body;
        const img = req.file;
        const { name, email, password } = data;
        
        const randomOtp = Math.floor(1000 + Math.random() * 9000);
        
        let checkEmail = await userModel.findOne({ email: email });
      

        if (checkEmail) {
            if (!checkEmail.isAccountActive) {
                return res.status(400).send({ status: false, msg: "Your Account is Blocked" });
            }
            if (checkEmail.isVerify) {
                return res.status(200).send({ status: false, msg: "Your Account is Verified. Please Log In",isVerify:checkEmail.isVerify });
            }

            checkEmail.otp = randomOtp;
            await checkEmail.save();

            verifyOtp(name, email, randomOtp);
            return res.status(200).send({ status: true, msg: "OTP sent successfully", email: checkEmail.email, id: checkEmail._id });
        }

        if (img) {
            const urlResult = await ImgUrl(img.path);
            data.profileImg = urlResult.secure_url;
        }


        data.password = await bcrypt.hash(password, 10);


        data.otp = randomOtp;
        data.role = "user";

        verifyOtp(name, email, randomOtp);
        const userDB = await userModel.create(data);

        res.status(201).send({
            status: true, msg: "User created successfully", profileImg: userDB.profileImg, name: userDB.name, email: userDB.email,
            id: userDB._id
        });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

exports.userOTPVerify = async (req, res) => {
    try {
        const userid = req.params.id;
        const { otp } = req.body;

        if (!otp) return res.status(400).send({ status: true, msg: "pls Provide OTP" });

        const userDB = await userModel.findById({ _id: userid });

        if (!userDB) return res.status(400).send({ status: true, msg: "User not found" });

        if (!((userDB.otp) == otp)) return res.status(400).send({ status: true, msg: "Wrong otp" });

        await userModel.findByIdAndUpdate({ _id: userid }, { $set: { isVerify: true } }, { new: true });
        res.status(200).send({ status: true, msg: "User Verify successfully" });

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

exports.reSendOTP = async (req, res) => {
    try {
        const userid = req.params.id;

        const randomOtp = Math.floor(1000 + Math.random() * 9000);

        let checkEmail = await userModel.findByIdAndUpdate({ _id: userid }, { $set: { otp: randomOtp } }, { new: true });

        if (checkEmail) {
            checkEmail.otp = randomOtp;
            await checkEmail.save();

            verifyOtp((checkEmail.name), (checkEmail.email), randomOtp);
            return res.status(200).send({ status: true, msg: "OTP sent successfully", id: checkEmail._id });
        }

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

exports.userLogIn = async (req, res) => {

    try {

        const { email, password } = req.body;
        console.log(email,password)

        const checkEmail = await userModel.findOne({ email: email });
        if (!checkEmail) return res.status(200).send({ status: false, msg: "User not found" });

        if ((checkEmail.isAccountActive) == false) return res.status(400).send({ status: false, msg: "Your Account is Blocked" });
        if ((checkEmail.isVerify) == false) return res.status(400).send({ status: false, msg: "pls Verify OTP" });

        const checkPassword = await bcrypt.compare(password, checkEmail.password);
        if (!checkPassword) return res.status(200).send({ status: false, msg: "Wrong Password" });

        const userToken = jwt.sign({ UserId: checkEmail._id }, process.env.UserTokenKey, { expiresIn: '12h' })

        res.status(200).send({ status: true, msg: "successfully Created Token", UserToken: userToken, UserId: checkEmail._id });
    }

    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


exports.AdminLogIn = async (req, res) => {

    try {

        const { email, password } = req.body;

        const checkEmail = await userModel.findOneAndUpdate({ email: email },
            { $set: { AdminOTPAuth: Math.floor(1000 + Math.random() * 9000) } }, { new: true });
            
        if (!checkEmail) return res.status(200).send({ status: false, msg: "User not found" });

        if (!((checkEmail.role) == 'admin')) return res.status(400).send({ status: false, msg: "Your are not Authorized" });

        const checkPassword = await bcrypt.compare(password, checkEmail.password);
        if (!checkPassword) return res.status(200).send({ status: false, msg: "Wrong Password" });

        const userToken = jwt.sign({ UserId: checkEmail._id }, process.env.AdminTokenKey, { expiresIn: '12h' })

        AdminAuthOTP(checkEmail.name, checkEmail.email, checkEmail.AdminOTPAuth);

        res.status(200).send({ status: true, msg: "successfully Created Token", UserToken: userToken, UserId: checkEmail._id });
    }

    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}   