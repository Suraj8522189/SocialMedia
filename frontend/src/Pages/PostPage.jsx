
import PostSidebar from "../components/PostSidebar";
import PostContainer from "../components/PostContainer";
// import NoPostSelected from "../components/NoPostSelected";
import { usePostStore } from "../store/usePostStore";
import GeminiContaner from "../components/GeminiContainer.jsx"

const PostPage = () => {
	const {selectedUser,showAllPosts} = usePostStore();
	return (
		<div className="h-screen w-screen bg-base-200">
		<div className="flex items-center justify-center pt-20 px-4">
			<div className="bg-base-100 rounded-lg shadow-cl w-full max-w-7xl h-[calc(100vh-6rem)]">
			<div className="flex h-full rounded-lg overflow-hidden">
				<PostSidebar/>
				{(!selectedUser && !showAllPosts)?<GeminiContaner />:<PostContainer />}
			</div>
			</div>
		</div>
		</div>
	);
};
export default PostPage;
