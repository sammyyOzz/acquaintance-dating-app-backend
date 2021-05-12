const Cards = require('../models/dbCards.js')

const getCards = (req, res) => {
    Cards.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data.reverse())
        }
    })
}

const storeCard = (req, res) => {
    const dbCard = req.body
    Cards.create(dbCard, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
}

module.exports = {
    getCards: getCards,
    storeCard: storeCard
}