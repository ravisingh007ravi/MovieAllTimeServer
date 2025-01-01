const express = require('express');
const router = express.Router();
const { createUser } = require('../controller/userController');


router.post('/createUser', createUser);

router.all('/*', (req, res) => { return res.status(404).send({ status: false, msg: 'Invalid Url' }) })
module.exports = router;