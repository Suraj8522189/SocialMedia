import { useEffect } from "react";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading,showAllPosts, setShowAllPosts } = usePostStore();
    
    const { onlineUsers, authUser } = useAuthStore();
    

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full min-[600px]:w-20 max-[600px]:w-15 max-[400px]:w-12 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="border-b border-base-300 w-full p-5">
            <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
            </div>
            
            <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
                <input
                type="checkbox"
                checked={showAllPosts}
                onChange={(e) =>{ showAllPosts?"":setSelectedUser(null),setShowAllPosts(e.target.checked)}}
                className="checkbox checkbox-sm"
                />
                <span className="text-sm">Show All Posts</span>
            </label>
            </div>
        </div>

        {/* //// users //// */}
        <div className="overflow-y-auto max-[600px]:hide-scrollbar w-full py-3">
            {[authUser,...users].map((user) => (
                <button
                    key={user._id}
                    onClick={() => {setSelectedUser(user),setShowAllPosts(false)}}
                    className={`
                    min-[600px]:w-full min-[1000px]:p-3 max-[500px]:px-0 max-[1025px]:p-1 flex items-center gap-3
                    hover:bg-base-300 transition-colors
                    ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                    `}
                >
                    <div className="relative mx-auto lg:mx-0">
                    <img
                        src={user.profilePic || "/avatar.jpg"}
                        alt={user.name}
                        className="size-12 object-cover rounded-full"
                    />
                    {onlineUsers.includes(user._id) && (
                        <span
                        className="absolute bottom-0 right-0 size-3 bg-green-500 
                        rounded-full ring-2 ring-zinc-900"
                        />
                    )}
                    </div>

                    {/* User info - only visible on larger screens user.fullName=authUser.fullName?"My Posts":user.fullName */}
                    <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate">{user.fullName===authUser.fullName?"My Posts(You)":user.fullName}</div>
                    <div className="text-sm text-zinc-400">
                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                    </div>
                </button>
            ))}

        </div>
        </aside>
    );
};
export default Sidebar;
