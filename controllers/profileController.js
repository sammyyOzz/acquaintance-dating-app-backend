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

    const { id } = req.params

    try {
        const profile = await Profile.findOne({ userId: id })

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

const likeProfile = async (req, res) => {

    try {
        const { id } = req.params
        const showUpdates = { new: true }

        if(!req.userId) res.status(401).json({message: "unauthenticated"})

        const profile = await Profile.findOne({ userId: id })    

        if(!profile) res.status(404).json({ message: 'Profile not found'})

        const index = profile.likes.findIndex(id  => id == req.userId)
    
        if(index == -1) {
            profile.likes.push(req.userId)
        } else {
            profile.likes.splice(index, 1)
        }

        const updatedProfile = await Profile.findOneAndUpdate({"userId": id}, profile, showUpdates)        

        res.status(200).json(updatedProfile)


    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getProfiles: getProfiles,
    showProfile: showProfile,
    updateProfile: updateProfile,
    likeProfile: likeProfile,
}