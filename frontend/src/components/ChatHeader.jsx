import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-base-300">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.jpg"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div className="leading-tight">
            <h3 className="font-medium text-sm sm:text-base truncate max-w-[140px] sm:max-w-none">
              {selectedUser.fullName}
            </h3>
            <p className="text-xs sm:text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-base-200 active:scale-95 transition"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
