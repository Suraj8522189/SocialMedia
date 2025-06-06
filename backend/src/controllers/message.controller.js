import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const getUsersForSidebar= async (req,res)=>{
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    }catch(error){
        console.log("error in getUsersForSidebar controller : ",error.message);
        res.status(500).json({message:"Internal Server error"});
    }
}

export const getMessage = async (req,res)=>{
    try{
        const {id:userToChatId} = req.params;
        const myId = req.user._id

        const message = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        });

        res.status(200).json(message);
    }catch(error){
        console.log("error in getMessage controller : ",error.message);
        res.status(500).json({message:"Internal Server error"});
    }
}

export const sendMessage = async (req,res)=>{
    try{
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploaderResponce = await cloudinary.uploader.upload(image);
            imageUrl = uploaderResponce.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();

        
        const receiverSocketId = getReceverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(200).json(newMessage);
    }catch(error){
        console.log("error in sendMessage controller : ",error.message);
        res.status(500).json({message:"Internal Server error"});
    }
}

