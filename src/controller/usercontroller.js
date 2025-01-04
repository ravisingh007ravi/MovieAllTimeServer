const userModel = require("../Models/userModel.js")
const { validName, validEmail, validPassword } = require('../Validation/AllValidation.js')
exports.createUser = async (req, res) => {
    try {
        const data = req.body;

        const { name, email, password,title } = data;

        const checkEmail = await userModel.findOne({ email: email });

        const validTitles = ['Mr', 'Miss', 'Other'];
        if (!title || !validTitles.includes(title)) {
            return res.status(400).send({ status: false, msg: "Enter a valid title (Mr, Miss, Other)" });
        }

        if (checkEmail) return res.status(400).send({ status: false, msg: "Email already exists" })

        if (!name) return res.status(400).send({ status: false, msg: "Name is Required" })
        if (!validName(name)) return res.status(400).send({ status: false, msg: "Enter a valid Name" })

        if (!email) return res.status(400).send({ status: false, msg: "Email is Required" })
        if (!validEmail(email)) return res.status(400).send({ status: false, msg: "Enter a valid Email" })

        if (!password) return res.status(400).send({ status: false, msg: "Password is Required" })
        if (!validPassword(password)) return res.status(400).send({ status: false, msg: "Enter a valid Password" })

        const randomOtp = Math.floor(1000 + Math.random() * 9000);
        data.otp = randomOtp;
        data.role = 'user';

        const userDB = await userModel.create(data);
        res.send({ status: true, msg: "User created successfully", data: userDB })
    }
    catch (e) { return res.status(500).send({ status: false, message: e.message }) }
}

exports.getAllUserData = async (req, res) => {
    try {
        const data = await userModel.find({"isDeleted": false}).select({ name: 1, email: 1, role: 1 }).sort({ createdAt: -1 });
        return res.status(200).send({ status: true, data: data });
    }
    catch (e) { return res.status(500).send({ status: false, msg: e.message }) }
}