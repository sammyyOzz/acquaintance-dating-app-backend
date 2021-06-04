const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dbCardsRouter = require('./routes/dbCards')
const userRouter = require('./routes/users')
const profileRouter = require('./routes/profiles')

//App config
const app = express()
require('dotenv').config()
const port = process.env.PORT || 8001
const connection_url = process.env.CONNECTION_URL

// Middlewares
app.use(cors())
app.use(express.json())
app.use('/images/', express.static('./images'));

// DB config
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

// API endpoints
app.get('/', (req, res) => res.status(200).send("Hello"))

app.use('/cards', dbCardsRouter)
app.use('/user', userRouter)
app.use('/profile', profileRouter)

// Listener
app.listen(port, () => console.log(`Listening on port: ${port}`))