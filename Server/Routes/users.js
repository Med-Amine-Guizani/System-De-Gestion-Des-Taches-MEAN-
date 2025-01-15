const express = require('express')
const router = express.Router()
const Usercontroller = require('../controllers/userController')




//sign-in route 
router.post('/signin',Usercontroller.signin)



//sign-up route 
router.post('/signup',Usercontroller.signup)


module.exports=router