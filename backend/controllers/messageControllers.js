
const asyncHandler = require('express-async-handler');
const Message = require("../models/messageModel");
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const fs = require('fs');
const sendMessage = asyncHandler(async (req,res) =>{

    const {content,chatId} = req.body;
    if(!content || !chatId)
    {
        console.log("Inavlid data passed into request!!");
        return res.sendStatus(400).send();
    }

    var newMessage = {
        sender:req.user._id,
        content:content,
        chat:chatId,
    };
    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender","name pic");
        message = await message.populate("chat");
        message = await User.populate(message,{
            path:"chat.users",
            select:"name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage:message,
        });
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})
const sendMessageFile = asyncHandler(async (req,res) =>{

    const {file,chatId} = req.body;
    if(!file || !chatId)
    {
        console.log("Inavlid data passed into request!!");
        return res.sendStatus(400).send();
    }
    fs.writeFile("../uploads/"+file,file.data)
    try{
    res.sendStatus(200).send();
    }
    catch (error) {
        res.status(400);
                throw new Error(error.message);
    }
    
//     try {
//         var message = await Message.create(newMessage);

//         message = await message.populate("sender","name pic");
//         message = await message.populate("chat");
//         message = await User.populate(message,{
//             path:"chat.users",
//             select:"name pic email",
//         });

//         await Chat.findByIdAndUpdate(req.body.chatId, {
//             latestMessage:message,
//         });
//         res.json(message);
//     } catch (error) {
//         res.status(400);
//         throw new Error(error.message);
//     }
})


const receiveMessage = asyncHandler(async ( req,res) => {
    try {
       const messages = await Message.find({ chat: req.params.chatId }).populate("sender","name pic email").populate("chat") 
       res.json(messages)
    } catch (error) {
        res.status(400)
        throw new Error("Message not found")
    }
})

module.exports ={sendMessage, receiveMessage,sendMessageFile};