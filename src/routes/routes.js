const express = require('express');
const multer = require('multer');
const router = express.Router();
const { createUser } = require('../controller/UserController.js');
const { validUserData, validUserLogInData } = require('../Middleware/UserValidation.js');

const upload = multer({ storage: multer.diskStorage({}) });

// User API's
router.post('/createUser', upload.single(),validUserData, createUser);
router.post('/userOTPVerify/:id', userOTPVerify);
router.post('/userLogIn', upload.single(),validUserLogInData, userLogIn);


router.all('/*', (req, res) => { return res.status(404).send({ status: false, msg: 'Invalid Url' }) })
module.exports = router;