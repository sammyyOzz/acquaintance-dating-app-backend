const mongoose = require('mongoose')

const Schema = mongoose.Schema

const messageSchema = new Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String }
}, {
    timestamps: true,
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message;