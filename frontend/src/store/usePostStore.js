import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const usePostStore = create((set, get) => ({
    users: [], // used
    posts: [],  // used
    selectedUser: null,   // used
    isUsersLoading: false,  // used
    isPostsLoading: false,   // used
    showAllPosts: false,   // used
    replies: [],   //.............
    likes: [], //............
    unlikes: [], //.............

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    setShowAllPosts: (showAllPosts) => set({ showAllPosts}),

    getUsers: async () => {
        // const { users } = get();
        set({ isUsersLoading: true });
        try {
        const res = await axiosInstance.get("/posts/users");
        set({ users: res.data });
        
        // console.log("users",users);
        } catch (error) {
        toast.error(error.response.data.message);
        } finally {
        set({ isUsersLoading: false });
        }
    },

    createPost: async (postData) => {
        const { posts } = get();
        try {
        const res = await axiosInstance.post(`/posts/create`, postData);
        set({ posts: [ res.data, ...posts ] });
        
        } catch (error) {
        // toast.error(error.response.data.message);
        }
    },

    getPosts: async () => {
        // const {posts}  = get();
        set({ isPostsLoading: true });
        try {
        const res = await axiosInstance.get("/posts/feeds");
        set({ posts: res.data });
        set({likes:[]});
        set({unlikes:[]});
        set({replies:[]});
        // console.log("posts ",posts);
        } catch (error) {
        toast.error(error.response.data.message);
        } finally {
        set({ isPostsLoading: false });
        }
    },

    subscribeToPosts: () => {
        
        const socket = useAuthStore.getState().socket;

        socket.on("newPost", (newPost) => {
        
            set({
                posts: [ newPost,...get().posts],
            });
            toast.success(`newPost ${newPost.text}`);

        });
    },

    unsubscribeFromPosts: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newPost");
    },

    likeUnlikePost: async (postId) => {
        const { likes,unlikes } = get();
        try {
        const res = await axiosInstance.put(`/posts/like/${postId}`);
        
        if (res.data.like) {
            set({ likes: [...likes, postId] }); // Add like
            set({ unlikes: unlikes.filter(item => item !== postId) }); // Remove like
        } else {
            set({ unlikes: [...unlikes, postId] }); // Add unlike
            set({ likes: likes.filter(item => item !== postId) }); // Remove like
        }
        toast.success(res.data.message);
        

        } catch (error) {
        toast.error(error.response.data.message);
        }
    },

    replyPost: async (postId,replyData) => {
        const { replies } = get();
        try {
        const res = await axiosInstance.put(`/posts/reply/${postId}`,replyData);
        set({ replies: [...replies,{...res.data,postId}] });
        toast.success("Replied to the post");
        } catch (error) {
        toast.error(error.response.data.message);
        }
    },

    
    deletePost: async (postId) => {
        const { posts } = get();
        try {
            console.log("post deleting",postId);
            await axiosInstance.delete(`/posts/${postId}`);
            console.log("deleted");
        
        set({posts:posts.filter(item => item._id !== postId)});

        } catch (error) {
        toast.error(error.response.data.message);
        }
    },
    
    deleteOld: async () => {
        try {
            await axiosInstance.delete(`/posts/delete`);
            toast.success("deleted");
        
        } catch (error) {
        toast.error(error.response.data.message);
        }
    },







    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({ messages: res.data });
        } catch (error) {
        toast.error(error.response.data.message);
        } finally {
        set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
        set({ messages: [...messages, res.data] });
        } catch (error) {
        toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

}));