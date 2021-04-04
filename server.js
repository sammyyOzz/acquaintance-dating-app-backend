// import express from 'express'
// import mongoose from 'mongoose'
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Cards = require('./dbCards.js')

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

app.post('/tinder/card', (req, res) => {
    const dbCard = req.body

    Cards.create(dbCard, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.get('/tinder/cards', (req, res) => {

    Cards.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data.reverse())
        }
    })
})

// Listener
app.listen(port, () => console.log(`Listening on port: ${port}`))