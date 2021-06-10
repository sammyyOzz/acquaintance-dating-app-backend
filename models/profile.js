const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const profileSchema = new Schema({
    name: String,
    gender: String,
    age: String,
    favColour: String,
    favFood: String,
    favMusic: String,
    favSport: String,
    sexuality: String,
    hobby: String,
    aboutYourself: String,
    imageUrl: { type: String, default: "noImageAvatar.png" },
    likes: {
        type: [String],
        default: []
    },
    conversations: {
        type: [String],
        default: []
    },
    userId: {type: String, required: true}
}, {
    timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile;