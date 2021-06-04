const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Profile = require('../models/profile')

const signup = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body

    try {
        const existingUser = await User.findOne({ email })

        if(existingUser) return res.status(400).json({ message: "User already exists"})

        if(password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match"})

        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await User.create({
            name,
            email,
            imageUrl: '',
            password: hashedPassword
        })

        /**
         * create profile for each user upon registration
         */
        const profile = await Profile.create({
            name: result.name,
            gender: '',
            age: '',
            favColour: '',
            favFood: '',
            favMusic: '',
            favSport: '',
            sexuality: '',
            hobby: '',
            aboutYourself: 'I am new to dating apps',
            imageUrl: '',
            userId: result._id
        })

        const token = jwt.sign({ email: result.email, id: result._id },
            'test', // second argument which is a secret text to be stored in .env file
            { expiresIn: "1h" })

        res.status(201).json({ result, profile, token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "something went wrong"})
    }
}

const signin = async (req, res) => {

    const { email, password } = req.body

    try {
        const existingUser = await User.findOne({ email })

        if(! existingUser) return res.status(404).json({ message: "User doesn't exist"})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if(! isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials"})

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id },
                                'test', // second argument which is a secret text to be stored in .env file
                                { expiresIn: "1h" })

        res.status(200).json({ result: existingUser, token })

    } catch (error) {
        return res.status(500).json({ message: "something went wrong"})
    }
}

const googleSignIn = async (req, res) => {

    const { googleId, name, imageUrl } = req.body

    try {
        /**
         * create profile google users
         */
        const googleProfile = await Profile.findOne({userId: googleId})

        if(googleProfile) return res.status(200).json({ message: "Profile exists" })
        
        const profile = await Profile.create({
            name: name,
            gender: '',
            age: '',
            favColour: '',
            favFood: '',
            favMusic: '',
            favSport: '',
            sexuality: '',
            hobby: '',
            aboutYourself: 'I am new to dating apps',
            imageUrl: imageUrl,
            userId: googleId
        })

        return res.status(201).json({ message: "Profile created", profile: profile})
    
    } catch (error) {
        
    }
}

const getUsers = async (req, res) => {

    try {
        const users = await User.find()

        res.status(200).send(users)

    } catch (error) {
        console.log(error)
    }
}

const updateUser = async (req, res) => {

    try {
        const id = req.params.id
        const newDetails = req.body
        const showUpdates = { new: true }

        if (req.userId !== id) {
            throw res.status(401).json({ 
                message: "You do not have permission to change another user's details"
            })
        }

        const updatedUser  = await User.findByIdAndUpdate(id, newDetails, showUpdates)

        // const updatedUser = await User.findOneAndUpdate({"_id": req.params.id}, {$set: { name: newDetails.name, imgUrl: newDetails.imgUrl}}, showUpdates )

        res.status(200).json(updatedUser)

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    signup: signup,
    signin: signin,
    googleSignIn: googleSignIn,
    getUsers: getUsers,
    updateUser: updateUser,
}
