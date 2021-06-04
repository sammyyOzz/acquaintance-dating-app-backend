const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true},
    imageUrl: { type: String },
    password: { type: String, required: true },
    profile_id: { type: String }
}, {
    timestamps: true,
})

const User = mongoose.model('User', userSchema)

module.exports = User;