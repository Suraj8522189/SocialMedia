import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
// import { useChatStore } from "../store/useChatStore";
import { usePostStore } from "../store/usePostStore";

const PostHeader = () => {
    // const {  selectedUser } = useChatStore();
    const { showAllPosts,setShowAllPosts,selectedUser,setSelectedUser} = usePostStore();
    const { onlineUsers } = useAuthStore();
    
    return (
        <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="avatar">
                <div className="size-10 rounded-full relative">
                <img src={showAllPosts?"/avatar.jpg":selectedUser?.profilePic || "/avatar.jpg"} alt={selectedUser?.fullName} />
                </div>
            </div>

            {/* User info */}
            <div>
                <h3 className="font-medium">{showAllPosts?"All Posts":selectedUser?.fullName}</h3>
                <p className="text-sm text-base-content/70">
                {showAllPosts?(onlineUsers.length-1)+" online":
                onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"
                }
                </p>
            </div>
            </div>

            {/* Close button */}
            {
            showAllPosts?"":
                <button onClick={() => {setShowAllPosts(true),setSelectedUser(null)}}>
                <X />
                </button>
            }
        </div>
        </div>
    );
};
export default PostHeader;