const router = require('express').Router();
const profileController = require('../controllers/profileController')
const auth = require('../middleware/auth')
const imageUpload = require('../middleware/imageUpload');


router.get('/getprofiles', profileController.getProfiles)
router.get('/:id', profileController.showProfile)
router.patch('/updateprofile/:id', auth, imageUpload, profileController.updateProfile)

module.exports = router