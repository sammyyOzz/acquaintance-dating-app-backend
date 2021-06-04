const Profile = require('../models/profile')

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
        const showUpdates = { new: true }

        if (req.file) {
            newDetails.imageUrl = req.file.filename
        }
        
        if (req.userId !== id) {
            throw res.status(401).json({ 
                message: "You do not have permission to change another user's profile"
            })
        }

        const updatedProfile = await Profile.findOneAndUpdate({"userId": id}, newDetails, showUpdates )

        res.status(200).json(updatedProfile)

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getProfiles: getProfiles,
    showProfile: showProfile,
    updateProfile: updateProfile,
}