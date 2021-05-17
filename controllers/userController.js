const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const signup = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body

    try {
        const existingUser = await User.findOne({ email })

        if(existingUser) return res.status(400).json({ message: "User already exists"})

        if(password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match"})

        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await User.create({
            username,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ email: result.email, id: result._id },
            'test', // second argument which is a secret text to be stored in .env file
            { expiresIn: "1h" })

        res.status(200).json({ result, token })

    } catch (error) {
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

    // User.findOne({email})
    //     .then(user => {
    //         if (! user) return res.json(`User doesn't exist`)
    //     })
    //     .catch(err => res.json(err))
}

module.exports = {
    signup: signup,
    signin: signin
}
