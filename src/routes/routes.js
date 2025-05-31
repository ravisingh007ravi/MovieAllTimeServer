const express = require('express');
const multer = require('multer');
const router = express.Router();
const { createUser, userOTPVerify, userLogIn, reSendOTP } = require('../Controllers/UserController');
const { AdminLogIn } = require('../Controllers/AdminController')
const { ValidUserData, ValidUserLogInData } = require('../Middlewares/UserValid')
const { createProduct } = require('../Controllers/productController')

const upload = multer({ storage: multer.diskStorage({})});

// User API's
router.post('/createUser', upload.single('profileImage'), ValidUserData, createUser);
router.post('/userOTPVerify/:id', userOTPVerify);
router.get('/reSendOTP/:id', reSendOTP);
router.post('/userLogIn', upload.none(), ValidUserLogInData, userLogIn);

// User API's
router.post('/AdminLogIn', upload.none(), ValidUserLogInData, AdminLogIn);

//Product 
router.post('/CreateProduct', upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'images', maxCount: 10 }]),createProduct);


router.all('/*', (req, res) => res.status(404).send({ status: false, msg: 'Invalid URL' }));

module.exports = router;
