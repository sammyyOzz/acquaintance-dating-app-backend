const router = require('express').Router();
const { storeMessage, getMessages, getConversations } = require('../controllers/messageController')
const auth = require('../middleware/auth')

router.post('/:id/store', auth, storeMessage)
router.get('/:id', auth, getMessages)
router.get('/:id/conversations', auth, getConversations)

module.exports = router