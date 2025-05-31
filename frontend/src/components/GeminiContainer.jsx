import { useAuthStore } from "../store/useAuthStore";
import { Send } from "lucide-react";
import "./GeminiContainer.css"
import { useState } from "react";
import run from "./Gemini.jsx"
import NoChatSelected from "./NoChatSelected.jsx";

const ChatContainer = () => {
    const [input, setInput] = useState("");
    const [inputData, setInputData] = useState("");
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const {authUser} = useAuthStore();

    const delayPara=(index,nextWord)=>{
        setTimeout(function (){
            setResultData(prev=>prev+nextWord);
        },40*index);
    }

    const handleGeminiMessage=(e)=>{
        e.preventDefault();
        sendMessageToGemini(input)
        setInput("");
    }

    const sendMessageToGemini= async (input)=>{
        
        setLoading(true);
        setResultData("");
        setInputData(input);
        
        let response;
        response=await run(input);
        
        let response2 = response.split("\n**").join("* **");
        let responseArray=response2.split("**");
        let newResponse="";
        for(let i=0;i<responseArray.length;i++){
            if(i===0 || i%2 != 1){
                newResponse += responseArray[i];
            }else{
                newResponse += "<b>"+responseArray[i]+"</b>";
            }
        }
        newResponse=newResponse.split("* ").join("</br>");
        let newResponseArray=newResponse.split(" ");
        for(let i=0;i<newResponseArray.length;i++){
            const nextWord=newResponseArray[i];
            delayPara(i,nextWord+" ");
        }
        setLoading(false);
    }
        
    

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            
            {/* Gemini header */}
            <div className="p-2.5 border-b border-base-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    {/* Avatar */}
                        <div className="avatar">
                            <div className="size-10 rounded-full relative">
                            <img src={"/gemini.png"} alt="Gemini" />
                            </div>
                        </div>
                        {/* User info */}
                        <div>
                            <h3 className="font-medium">Gemini</h3>
                            <p className="text-sm text-base-content/70">
                            Online
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gemini Chat Body Start */}
            {(inputData.length===0)?<NoChatSelected/>:
            (<div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* User Text */}
                <div className="chat chat-end">
                    <div className=" chat-header avatar">
                        <div className="size-10 m-2 rounded-full border">
                            <img src={authUser.profilePic || "/avatar.jpg"} alt="profile pic"/>
                        </div>
                    </div>
                    <div className="chat-bubble">
                        <p>{inputData}</p>
                    </div>
                </div>
                
                {/* Gemini Chat */}
                <div className="chat chat-start">
                    <div className=" chat-header avatar">
                        <div className="size-10 m-2 rounded-full border">
                            <img src={"/gemini.png"} alt="profile pic"/>
                        </div>
                    </div>
                    {!loading && (
                        <div className="chat-bubble result-data">
                            <p dangerouslySetInnerHTML={{__html:resultData}}></p>
                        </div>
                    )}
                </div>
                {/* Gemini Chat Body End */}

                
                {/* loading */}
                <div className="result-data">
                    {loading &&
                        (<div className="loader">
                            <hr />
                            <hr />
                            <hr />
                        </div>)
                    }
                </div>
            </div>)}


            {/* Gemini Chat Input */}
            <div className="p-4 w-full">
                <form
                    onSubmit={handleGeminiMessage}
                    className="flex items-center gap-2"
                >
                    <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Enter the prompt here"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    

                    </div>
                    <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={!input.trim()}
                    >
                    <Send size={22} />
                    </button>
                </form>
            </div>

        </div>
    );
};
export default ChatContainer;