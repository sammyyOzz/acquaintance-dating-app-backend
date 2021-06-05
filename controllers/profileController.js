const Profile = require('../models/profile')
const fs = require('fs')
const path = require('path');

const getProfiles = async (req, res) => {

    try {
        const profiles = await Profile.find()

        res.status(200).send(profiles)

    } catch (error) {
        console.log(error)
    }
}

const showProfile = async (req, res) => {

    const userId = req.params.id

    try {
        const profile = await Profile.findOne({ userId: userId })

        if (profile) {
            return res.status(200).json({ result: profile })
        } else {
            return res.status(400).json({ message: "profile not found"})
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const updateProfile = async (req, res) => {

    try {
        const id = req.params.id
        const newDetails = req.body
        const showUpdates = { new: false }

        if (req.file) {
            newDetails.imageUrl = req.file.filename
        }
        
        if (req.userId !== id) {
            throw res.status(401).json({ 
                message: "You do not have permission to change another user's profile"
            })
        }

        const profileBeforeUpdate = await Profile.findOneAndUpdate({"userId": id}, newDetails, showUpdates)

        if(req.file && profileBeforeUpdate.imageUrl !== "noImageAvatar.png") {
            const oldImagePath = path.join(__dirname, "..", "images", profileBeforeUpdate.imageUrl)    
            
            if(fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath)
            }
        }

        res.status(200).json({ message: 'Updated successfully' })

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getProfiles: getProfiles,
    showProfile: showProfile,
    updateProfile: updateProfile,
}