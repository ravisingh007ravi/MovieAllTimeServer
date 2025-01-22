const { validName, validEmail, validPassword } = require('../Validation/AllValidation.js');

exports.validUserData = (req, res, next) => {
    try {
        const data = req.body;
        const { name, email, password, title } = data;

        const validTitles = ['Mr', 'Miss', 'Other'];
        if (!title || !validTitles.includes(title))
        return res.status(422).send({ status: false, msg: "Enter a valid title (Mr, Miss, Other)" });

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