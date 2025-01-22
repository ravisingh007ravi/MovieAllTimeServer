const express = require('express');
const multer = require('multer');
const router = express.Router();
const { createUser, userOTPVerify } = require('../controller/userController');
const { validUserData } = require('../Middleware/userValidation.js');

const upload = multer({ storage: multer.diskStorage({}) });

//User API's
router.post('/createUser', upload.single('profileImg'), validUserData, createUser);
router.post('/userOTPVerify/:id', userOTPVerify);


router.all('/*', (req, res) => { return res.status(404).send({ status: false, msg: 'Invalid Url' }) })
module.exports = router;