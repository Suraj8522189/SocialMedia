import express from "express";
import {
	// sendPost,
	// getPost,
	// getFeedPosts,
	// getUserPosts,
	deletePost,
	likeUnlikePost,
	replyToPost,
	getUsersForSidebar,
	createPost,
	getPosts,
	deleteOldUsers,
	deleteOldMessages,
	deleteOldPosts,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.post("/create", protectRoute, createPost );
router.get("/feeds", getPosts);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);
router.delete("/:id", protectRoute, deletePost);


router.delete("/old/users", protectRoute, deleteOldUsers);
router.delete("/old/messages", protectRoute, deleteOldMessages);
router.delete("/old/posts", protectRoute, deleteOldPosts);


// router.get("/feed", protectRoute, getFeedPosts);
// router.get("/:id", getPost);
// router.get("/user/:username", getUserPosts);
// router.post("/send", protectRoute, sendPost);

export default router;