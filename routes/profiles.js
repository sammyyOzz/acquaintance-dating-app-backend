const router = require('express').Router();
const { getProfiles, showProfile, updateProfile, likeProfile } = require('../controllers/profileController')
const auth = require('../middleware/auth')
const imageUpload = require('../middleware/imageUpload');

router.get('/getprofiles', getProfiles)
router.get('/:id', showProfile)
router.patch('/:id/updateprofile', auth, imageUpload, updateProfile)
router.patch('/:id/likeprofile', auth, likeProfile)

module.exports = router