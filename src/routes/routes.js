const express = require('express');
const multer = require('multer');
const router = express.Router();
const { createUser, userOTPVerify, userLogIn } = require('../Controllers/UserController');
const {ValidUserData,ValidUserLogInData} =require('../Middlewares/UserValid')
// const { validUserData, validUserLogInData } = require('../Middleware/UserValidation.js');

const upload = multer({ storage: multer.diskStorage({}) });

// User API's
router.post('/createUser', upload.single('profileImage'),ValidUserData, createUser);
router.post('/userOTPVerify/:id', userOTPVerify);
router.post('/userLogIn', upload.none(),ValidUserLogInData, userLogIn);

router.all('/*', (req, res) => res.status(404).send({ status: false, msg: 'Invalid URL' }));

module.exports = router;
