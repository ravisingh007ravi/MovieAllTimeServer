const userModel = require("../Models/userModel.js")

exports.createUser = async(req, res) => {
    try {
        const data = req.body;

        const user = await userModel.create(data);
        res.send({ status: true, msg: "User created successfully", data: user })
    }
    catch (e) { return res.status(500).send({ status: false, message: e.message }) }
}