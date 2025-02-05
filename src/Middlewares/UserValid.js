const { validName, validEmail, validPassword } = require('../Validation/AllValidation.js');

exports.ValidUserData = (req, res, next) => {
    try {
        const data = req.body;
        const { name, email, password } = data;

        if (!name) return res.status(422).send({ status: false, msg: "Name is required" });
        if (!validName(name)) return res.status(422).send({ status: false, msg: "Enter a valid name" });

        if (!email) return res.status(422).send({ status: false, msg: "Email is required" });
        if (!validEmail(email)) return res.status(422).send({ status: false, msg: "Enter a valid email" });

        if (!password) return res.status(422).send({ status: false, msg: "Password is required" });
        if (!validPassword(password)) return res.status(422).send({ status: false, msg: "Enter a valid password" });

        next()
    }
    catch (error) { res.status(500).send({ status: false, message: error.message }); }
}


exports.ValidUserLogInData = (req, res, next) => {
    try {
        const data = req.body;
        const { email, password } = data;

        if (!email) return res.status(422).send({ status: false, msg: "Email is required" });
        if (!validEmail(email)) return res.status(422).send({ status: false, msg: "Enter a valid email" });

        if (!password) return res.status(422).send({ status: false, msg: "Password is required" });
        if (!validPassword(password)) return res.status(422).send({ status: false, msg: "Enter a valid password" });

        next()
    }
    catch (error) { res.status(500).send({ status: false, message: error.message }); }
}