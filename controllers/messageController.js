const Message = require('../models/message')
const Profile = require('../models/profile')
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true
});

const storeMessage = async (req, res) => {

    try {
        const sender = req.userId
        const receiver = req.params.id
        const message = req.body.message

        if(!sender) return res.status(401).send({ message: "unauthenticated" })

        if(sender == receiver) return res.status(400).json({ message: "you are not allowed to send messages to yourself" })

        const newMessage = await Message.create({ sender, receiver, message })

        pusher.trigger("conversations-channel", "new-message", {
            message: newMessage
        });

        const senderProfile = await Profile.findOne({ userId: sender })

        if(!senderProfile) res.status(404).json({ message: 'Profile not found' })

        const senderIndex = senderProfile.conversations.findIndex(id  => id == receiver)

        if(senderIndex == -1) {
            senderProfile.conversations.push(receiver)            
        }

        const updatedSenderProfile = await Profile.findOneAndUpdate({ userId: sender }, senderProfile, { new: true })

        const receiverProfile = await Profile.findOne({ userId: receiver })

        if(!receiverProfile) res.status(404).json({ message: 'Profile not found' })

        const receiverIndex = receiverProfile.conversations.findIndex(id => id == sender)

        if(receiverIndex == -1) {
            receiverProfile.conversations.push(sender)
        }

        const updatedReceiverProfile = await Profile.findOneAndUpdate({ userId: receiver }, receiverProfile, { new: true })

        res.status(201).json({ newMessage: newMessage, sender: updatedSenderProfile, receiver: updatedReceiverProfile})

    } catch (error) {
        // res.status(500).send({ message: error })
        console.log(error)
    }
}

const getMessages = async (req, res) => {

    try {
        const sender = req.userId
        const receiver = req.params.id

        const senderMessages = await Message.find({
            sender: sender,
            receiver: receiver
        })

        const receiverMessages = await Message.find({
            sender: receiver,
            receiver: sender
        })

        const chat = [...senderMessages, ...receiverMessages].sort((a, b) => a.createdAt - b.createdAt)

        res.status(200).send(chat)

    } catch (error) {
        res.status(500).send({ message: error })
    }
}

const getConversations = async (req, res) => {

    const { id } = req.params

    try {

        const profile = await Profile.findOne({ userId: id })

        if(!profile) return res.status(404).json({ message: "profile not found" })

        const conversationIds = profile.conversations

        // const conversations = await Profile.find({ userId: { $all: conversationIds } })

        const conversations = []

        for (let i = 0; i < conversationIds.length; i++) {

            let conversation = await Profile.findOne({ userId: conversationIds[i] })

            if (conversation) {
                conversations.push(conversation)
            }
        }

        if(!conversations) return res.status(404).send({ message: "you do not have any active conversations" })

        res.status(200).send(conversations)

    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    getMessages: getMessages,
    storeMessage: storeMessage,
    getConversations: getConversations,
}