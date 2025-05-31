// import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Send, Trash, Trash2, Users} from 'lucide-react';
import { usePostStore } from "../store/usePostStore";
import PostHeader from "./PostHeader";
import PostInput from "./PostInput"
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const PostContainer = () => {
    // let arr=[1,2,3,4,5]
    const {
        users,
        posts,
        getPosts,
        isPostsLoading,
        selectedUser,
        subscribeToPosts,
        unsubscribeFromPosts,
        showAllPosts,
        likeUnlikePost,
        replies,
        likes,
        unlikes,
        replyPost,
        deletePost,
    } = usePostStore();
    const { authUser } = useAuthStore();
    const postTopRef = useRef(null);
    const [deletePostId, setDeletePostId] = useState("");
    const [replyText, setReplyText] = useState("");
    const [replyTo, setReplyTo] = useState("")

    // console.log("posts",posts);
    useEffect(() => {
        getPosts();

        subscribeToPosts();

        return () => unsubscribeFromPosts();
    }, [
        getPosts,
        subscribeToPosts, unsubscribeFromPosts
    ]);

    useEffect(() => {
        if (postTopRef.current && posts) {
            postTopRef.current.scrollTo({ behavior: "smooth", block: "start" });
        }
    }, [posts]);

    let selectedPosts=[];
    if(showAllPosts){
        selectedPosts=posts;
    }
    else{
        selectedPosts = posts.filter((post)=>post.postedBy===selectedUser._id);
    }

    const handelDeletePost = async (postId)=>{
        if(!postId) console.log("No deletePostId");
        console.log(postId);
        await deletePost(postId);
        setDeletePostId("");
    }
    const handelLikeUnlikePost=async(postId)=>{
        await likeUnlikePost(postId);
    }
    


    if (isPostsLoading) {
        return (
        <div className="flex-1 flex flex-col overflow-auto">
            <PostHeader/>
            <MessageSkeleton />
            <PostInput />
        </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
        {/* ////////// */}
        <div className="flex-1 overflow-y-auto max-[700px]:scrollbar-none p-4 px-0 space-y-4">
            <PostHeader/>
            {selectedPosts.map((post)=>(
                
                <div
                    key={post._id}
                    className={`chat ${post.postedBy===authUser._id?"chat-end":"chat-start"} min-[700px]:mx-5  `}
                    ref={postTopRef}
                >
                    <div className={`chat-image max-[750px]:chat-header avatar`}>
                        <div className="size-10 rounded-full border">
                            <img
                            src={post.profilePic || users.filter(user=>user._id===post.postedBy).profilePic || "/avatar.jpg"}
                            alt="profile pic"
                            />
                        </div>
                    </div>


                    <div className="chat-bubble flex flex-col text-center">
                        <div className="inline-block max-w-full overflow-auto ">
                            {post.img && <img
                            src={post.img}
                            alt="Attachment"
                            className="sm:max-w-[400px] min-w-[300px] rounded-md mb-2 object-contain"
                            />}
                        </div>
                        {/* //// Post text //// */}
                        <p>{post.text || "This is a Post"}</p>

                        <div className={`flex justify-between min-w-48`}>
                            <div className={`flex space-x-4 items-center text-gray-600 ${deletePostId===post._id.toString()?"hidden":""}`}>
                                <button onClick={()=>{handelLikeUnlikePost(post._id)}} className="hover:text-red-500 text-gray-300 space-x-1">
                                    <p className="inline-block">{post.likes.length-(post.likes.includes(authUser._id) && unlikes.includes(post._id)?1:0)+(!post.likes.includes(authUser._id) && likes.includes(post._id)?1:0)}</p>
                                    <Heart className={`w-5 h-5 inline-block ${(post.likes.includes(authUser._id) && !unlikes.includes(post._id)  || !post.likes.includes(authUser._id) && likes.includes(post._id) )?"text-red-500":""} `} />
                                </button>
                                <button onClick={()=>setReplyTo(replyTo===post._id?"":post._id)} className="hover:text-blue-500 text-gray-300 space-x-1">
                                    <p className="inline-block">{post.replies.length+replies.filter(item=>item.postId===post._id).length}</p>
                                    <MessageCircle className="w-5 h-5 inline-block" />
                                </button>
                                {post.postedBy===authUser._id && <button onClick={()=>setDeletePostId(post._id)} className="hover:text-red-500 text-gray-300 space-x-1">
                                    <Trash2 className="w-5 h-5 inline-block" />
                                </button>}
                            </div>

                            <div className={`flex space-x-2 items-center ${deletePostId===post._id.toString()?"":"hidden"}`}>
                                <button onClick={()=>handelDeletePost(post._id)} className="hover:text-black border px-2 bg-red-500 text-white font-bold space-x-1">
                                    <p className="inline-block">Delete</p>
                                </button>
                                <button onClick={()=>setDeletePostId("")} className="hover:text-black border px-2 bg-blue-600 text-white font-bold space-x-1">
                                    <p className="inline-block">Cancel</p>
                                </button>
                            </div>

                            {/* ------- */}
                            <div className="m-1">
                                {/* /// Time /// */}
                                <time className="text-s opacity-50 ml-1 text-gray-300">
                                    {formatMessageTime(post.createdAt)}
                                </time>
                            </div>

                        </div>
                        {replyTo===post._id && <div className="flex-1 flex flex-col overflow-auto">
                            <div className="w-72 my-2 overflow-y-auto min-h-0 max-h-28 border-gray-500 border-t-2">
                                {[...post.replies,...replies.filter(item=>item.postId===post._id)].reverse().map((reply)=>(
                                    <div key={reply._id} className=" justify-start mt-2">
                                        <div className="size-6 border-t flex w-full">
                                            <img
                                            src={reply.profilePic || users.filter(user=>user._id===reply.userId).profilePic || "/avatar.jpg"}
                                            alt="profile pic"
                                            className="rounded-full inline-block"
                                            />
                                            <p className="inline-block text-sm mx-2 text-red-400">
                                                {reply.fullName}
                                            </p>
                                        </div>
                                        <p>{reply.text}</p>
                                    </div>
                                    ))
                                }
                            </div>
                            <form
                                onSubmit={(e)=>{
                                    e.preventDefault();
                                    replyPost(post._id,{userId:authUser._id,text:replyText});
                                    setReplyText("");
                                }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    className="w-full input input-bordered rounded-lg h-8"
                                    placeholder="Reply to the Post"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-sm btn-circle"
                                    disabled={!replyText.trim()}
                                    >
                                    <Send size={22} />
                                </button>
                            </form>
                        </div>}
                    </div>
                    
                </div>
            ))}
        </div>
        {/* ////////// */}

        {showAllPosts || selectedUser?._id===authUser._id?
            <PostInput/>
        :""
        }
        </div>
    );
};
export default PostContainer;