import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { v2 as cloudinary } from "cloudinary";
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

export const createPost = async (req,res)=>{
    try{
        const {postedBy,text,image} = req.body;
        const senderId = req.user._id;
		const fullName = req.user.fullName;
		let profilePic = req.user.profilePic.toString();
		if(!profilePic) profilePic="/avatar.jpg";

		if (postedBy._id.toString() !== senderId.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

        let imageUrl;
        if(image){
            const uploaderResponce = await cloudinary.uploader.upload(image);
            imageUrl = uploaderResponce.secure_url;
        }

        const newPost = new Post({
            postedBy : senderId,
			profilePic,
			fullName,
            text,
            img : imageUrl,
        })

        await newPost.save();
		console.log("post created",newPost)
        
		io.emit("newPost",newPost);
    

        res.status(200).json(newPost);
    }catch(error){
        console.log("error in sendPost controller : ",error.message);
        res.status(500).json({message:"Internal Server error"});
    }
}

export const getPosts = async (req, res) => {
	try {
		const posts = await Post.find().sort({ createdAt: -1 });
		// console.log(posts);
		if (!posts) {
			return res.status(404).json({ error: "Posts not found" });
		}

		res.status(200).json(posts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully",like:false });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully",like:true });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const profilePic = req.user.profilePic;
		const fullName = req.user.fullName;
		// console.log("req.body=",req.body);
		// console.log("text=",text);

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, profilePic, fullName };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		console.log(post);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const deleteOldUsers = async ()=>{
    try {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

        const result = await User.deleteMany({
        createdAt: { $lte: oneWeekAgo }
        });
		
        console.log(`result oldUsersDeleted= ${result.deletedCount}`);
		
    } catch (error) {
        console.log('Error deleting old users:', error);
    } finally {
        await client.close();
    }
}

export const deleteOldMessages = async ()=>{
    try {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

        const result = await Message.deleteMany({
        createdAt: { $lte: oneWeekAgo }
        });

        console.log(`result1 oldMessagesDeleted= ${result.deletedCount}`);
		
    } catch (error) {
        console.log('Error deleting old messages:', error);
    }
}

export const deleteOldPosts = async ()=>{
    try {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

        const result = await Post.deleteMany({
        createdAt: { $lte: oneWeekAgo }
        });

        console.log(`result oldPostsDeleted= ${result.deletedCount}`);
		
    } catch (error) {
        console.log('Error deleting old Posts:', error);
    } finally {
        await client.close();
    }
}









const sendPost = async (req, res) => {
	try {
		const { postedBy, text } = req.body;
		let { img } = req.body;

		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({ postedBy, text, img });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};


const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const feedPosts = await Post.find().sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export { sendPost, getPost, getFeedPosts, getUserPosts };