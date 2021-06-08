const router = require('express').Router();
const { signup, signin, googleSignIn, getUsers, updateUser } = require('../controllers/userController')
const auth = require('../middleware/auth')

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/googlesignin', googleSignIn)
router.get('/getusers', getUsers)
router.patch('/updateuser/:id', auth, updateUser)

module.exports = router