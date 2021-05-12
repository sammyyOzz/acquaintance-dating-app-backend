const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Cards = require('./models/dbCards.js')
const dbCardsRouter = require('./routes/dbCards')

//App config
const app = express()
require('dotenv').config()
const port = process.env.PORT || 8001
const connection_url = process.env.CONNECTION_URL

// Middlewares
app.use(cors())
app.use(express.json())

// DB config
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

// API endpoints
app.get('/', (req, res) => res.status(200).send("Hello"))

app.use('/cards', dbCardsRouter)

// Listener
app.listen(port, () => console.log(`Listening on port: ${port}`))