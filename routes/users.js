const router = require('express').Router();
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

router.post('/signup', userController.signup)
router.post('/signin', userController.signin)
router.post('/googlesignin', userController.googleSignIn)
router.get('/getusers', userController.getUsers)
router.patch('/updateuser/:id', auth, userController.updateUser)

module.exports = router