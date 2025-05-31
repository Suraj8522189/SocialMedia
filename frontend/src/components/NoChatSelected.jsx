// import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
    return (
        <div className="w-full flex flex-1 flex-col items-center justify-center p-16 py-2  bg-base-100/50">
        <div className="max-w-md text-center space-y-2 min-[400]:space-y-2">
            {/* Icon Display */}
            <div className="flex justify-center gap-4 mb-4">
            <div className="relative">
                <div
                className="w-32 h-32 rounded-2xl bg-primary/10 flex items-center
                justify-center "
                >
                <img src="./logo.png" alt="logo" className="w-28 h-28 rounded-2xl text-primary "/>
                </div>
            </div>
            </div>

            {/* Welcome Text */}
            <h2 className="text-2xl font-bold">Welcome to SocialMedia</h2>
            <p className="text-base-content/60 inline-block mx-2">
            Select a User from the sidebar Or chat with
            </p>
            <h2 className="text-2xl font-bold inline-block text-blue-400">Gemini</h2>
        </div>
        </div>
    );
};

export default NoChatSelected;