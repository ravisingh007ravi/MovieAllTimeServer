const express = require('express');
const router = express.Router();
const { createUser, getAllUserData } = require('../controller/userController');


router.post('/createUser', createUser);
router.get('/getAllData', getAllUserData);

router.all('/*', (req, res) => { return res.status(404).send({ status: false, msg: 'Invalid Url' }) })
module.exports = router;