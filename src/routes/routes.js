const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({ storage: multer.diskStorage({}) });

const { createUser, getAllUserData } = require('../controller/userController');


router.post('/createUser',upload.single("profileImg"), createUser);
router.get('/getAllData', getAllUserData);

router.all('/*', (req, res) => { return res.status(404).send({ status: false, msg: 'Invalid Url' }) })
module.exports = router;