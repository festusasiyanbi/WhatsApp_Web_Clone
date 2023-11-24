import React from "react";
import { useNavigate } from "react-router-dom";

const ChatList = ({ chats }) => {
  const navigate = useNavigate();

  const handleSelect = (user) => {
    navigate(`/${user.email}`);
  };

  return (
    <div className="chats w-full flex flex-col justfify-center space-y-6 py-3 text-white">
      {chats?.sort((a, b) => b.timeStamp - a.timeStamp).map((chat, index) => (
        <div
          className="userChats w-full flex items-center space-x-5 cursor-pointer"
          key={index}
          onClick={() => handleSelect(chat)}
        >
          <div className="w-[13%]">
            <img src={chat?.photoURL} alt="" className="w-[50px] h-[50px] rounded-[50%]" />
          </div>
          <div className="userChatInfo border-gray-300 border-b-[0.7px] py-2 w-[85%]">
            <span className="w-full flex justify-between pr-3 items-center">
              <span>{chat?.displayName}</span>
              <span className="timestamp">
                {chat?.timeStamp?.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </span>
            <p 
              title={chat.lastMessage}
              className={`text-[13px] text-gray-400 ${chat.lastMessage === "🚫 This message has been deleted" ? "text-[13px] italic" : ""}`}
            >
              {chat.lastMessage?.slice(0, 50) + `${chat.lastMessage.length >= 50 ? "..." : ''}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;