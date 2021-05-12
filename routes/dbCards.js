const router = require('express').Router();
const dbCardsController = require('../controllers/dbCardsController')

router.get('/', dbCardsController.getCards)
router.post('/store', dbCardsController.storeCard)

module.exports = router