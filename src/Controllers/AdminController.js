const userModel = require("../Models/userModel.js")
const { AdminAuthOTP } = require('../Mail/sendMail.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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