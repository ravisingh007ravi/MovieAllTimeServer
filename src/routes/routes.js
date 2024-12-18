const express = require('express');
const router = express.Router()
const multer = require('multer')//used to upload img or videos
const { CreateUsers, UserLogIn  } = require('../controller/usercontroller')
const { CreateAdmin, getAllUserData, AdminLogIn } = require('../controller/adminController')
const { CreateShopkeeper } = require('../controller/shopkeeperController')

const upload = multer({ storage: multer.diskStorage({}), })

// User API's
router.post('/CreateUsers', upload.single('profileimg'), CreateUsers)
router.post('/UserLogIn', upload.single(), UserLogIn)

// Admin Api's
router.post('/CreateAdmin', upload.single(), CreateAdmin)
router.post('/AdminLogIn', upload.single(), AdminLogIn)
router.get('/getAllUserData', getAllUserData)

// Shopkeeper API's
router.post('/CreateShopkeeper', upload.single(), CreateShopkeeper)


router.all('/*', (req, res) => {
    return res.status(400).send({ status: false, msg: 'Invalid Url' })
})

module.exports = router;