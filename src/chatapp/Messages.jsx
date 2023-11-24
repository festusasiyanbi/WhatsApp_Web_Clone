import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/Firebase";
import Message from "./Message";

const Messages = ({ messages, setMessages, chatBoxRef }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedMessageToDelete, setSelectedMessageToDelete] = useState(null);
  const [messageOptions, setMessageOptions] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleMessageHover = (messageIndex) => {
      setHoveredMessage(messageIndex);
  };

  const handleSelectedMessageToDelete = (messageIndex) => {
    setDeleteModal(messageIndex);
    setMessageOptions(null);
    setSelectedMessageToDelete(messageIndex);
  };

  const handleOpenMessageOptions = (messageIndex) => {
    setMessageOptions(messageIndex);
    if (messageOptions) setMessageOptions(null);
  };
  
  const handleDeleteMessage = async (index) => {
      const messageToDelete = messages.find((message) => index === selectedMessageToDelete);
  
      if (!messageToDelete) {
        console.log("No message to delete");
        return;
      }
  
      const deletedMessage = "🚫 This message has been deleted";
      const messageIndex = messages.findIndex((message) => index === selectedMessageToDelete);
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = { ...messageToDelete, text: deletedMessage };
      
      try {
        const chatMessagesRef = doc(db, 'chats', currentUser.email)
        const docSnapshot = await getDoc(chatMessagesRef, 'messages');
        if(docSnapshot.exists()) {
          await updateDoc(chatMessagesRef, {
          messages: [...messages.slice(0, messageIndex), updatedMessages[messageIndex], ...messages.slice(messageIndex + 1)],
          });
        }
        // Update the state with the modified messages
        console.log(docSnapshot)
        console.log(updatedMessages)
        setMessages(updatedMessages);
    
        // Close the delete modal
        setDeleteModal(false);
      } catch (error) {
      console.error("Error updating message in state:", error);
    }
  };

  const copyMessageToClipboard = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      document.body.appendChild(textArea);

      textArea.select();
      textArea.setSelectionRange(0, textArea.value.length);

      document.execCommand("copy");

      document.body.removeChild(textArea);
      setMessageOptions(null);
    } catch (error) {
      console.error("Error copying message to clipboard:", error);
    }
  };

  const handleCopyMessage = (messageText) => {
    copyMessageToClipboard(messageText);
  };

  return (
    <>
      <div className="overflow-y-auto h-full py-3 z-1" ref={chatBoxRef}>
        {messages && messages.map((message, index) => (
          <div
            ref={ref}
            key={index}
            className={`px-20 ${message.senderEmail === currentUser.email && "owner"}`}
          >
            <div
              className=
                {`bg-zinc-100 text-black mb-3 w-fit p-1 rounded-[5px] max-w-[70%]
                ${message.text === "🚫 This message has been deleted" ? "text-[13px] italic" : ""}`}
              onMouseEnter={() => handleMessageHover(index)}
              onMouseLeave={() => handleMessageHover(null)}
            >
              <Message 
                message={message}
                index={index}
                hoveredMessage={hoveredMessage}
                handleMessageHover={handleMessageHover}
                handleOpenMessageOptions={handleOpenMessageOptions}
                handleCopyMessage={handleCopyMessage}
                handleSelectedMessageToDelete={handleSelectedMessageToDelete}
                handleDeleteMessage={handleDeleteMessage}
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                messageOptions={messageOptions}
              />
              </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default Messages;
