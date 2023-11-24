import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import DataContext from "../context/DataContext";
import Picker from "emoji-picker-react";
import {
  addDoc,
  collection,
  doc,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase/Firebase";
import { v4 as uuid } from 'uuid'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faPlus } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineSend } from "react-icons/ai";
import ImageUploader from "./ImageUploader";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Input = ({ emailId, chatUser }) => {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [openEmojiBox, setOpenEmojiBox] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const { fileToggler, setFileToggler } = useContext(DataContext);
  const { currentUser } = useContext(AuthContext);

  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileTogglerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setOpenEmojiBox(false);
      }
    };

    if (openEmojiBox) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openEmojiBox]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fileTogglerRef.current && !fileTogglerRef.current.contains(event.target)) {
        setFileToggler(false);
      }
    };

    if (fileToggler) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [fileToggler]);

  const uploadImages = async (images) => {
    const imageUrls = [];
  
    const storageRef = ref(storage, uuid());
    for (const image of images) {
      // Generate a unique name for each image (you can use a timestamp or UUID)
      const imageName = `${new Date().getTime()}_${image.name}`;
      const imageRef = ref(storageRef, imageName);
  
      try {
        // Upload the image to Firebase Storage
        await uploadBytes(imageRef, image);
  
        // Get the download URL for the uploaded image
        const imageUrl = await getDownloadURL(imageRef);
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        // Handle any errors or provide feedback to the user
      }
    }
    return imageUrls;
  };

  const handleSend = async () => {
    if (emailId) {
      // Create a timestamp
      const timestamp = new Date();
  
      // Create a payload object for the message
      const payload = {
        senderEmail: currentUser.email,
        receiverEmail: emailId,
        timeStamp: timestamp,
      };
  
      if (text) {
        // If there is text, add it to the payload
        payload.text = text;
      }
  
      if (images.length > 0) {
        // If there are images, upload them and add their download URLs to the payload
        const uploadedImageUrls = await uploadImages(images);
        payload.images = uploadedImageUrls;
      }
  
      // Send the message
      const senderMessageRef = collection(db, 'chats', currentUser.email, 'messages');
      await addDoc(senderMessageRef, payload);
  
      // Send the same message to the receiver
      const receiverMessageRef = collection(db, 'chats', emailId, 'messages');
      await addDoc(receiverMessageRef, payload);
  
      // Update chat list for sender and receiver
      const senderChatlistPayload = {
        email: chatUser.email,
        displayName: chatUser.displayName,
        photoURL: chatUser.photoURL,
        lastMessage: text || "Photo",
        timeStamp: timestamp,
      };
      const receiverChatlistPayload = {
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        lastMessage: text || "Photo",
        timeStamp: timestamp,
      };
  
      const senderDocRef = doc(db, 'chatlist', currentUser.email);
      const senderListCollectionRef = collection(senderDocRef, 'list');
      const newSenderDocRef = doc(senderListCollectionRef, emailId);
      await setDoc(newSenderDocRef, senderChatlistPayload);
  
      const receiverDocRef = doc(db, 'chatlist', emailId);
      const receiverListCollectionRef = collection(receiverDocRef, 'list');
      const newReceiverDocRef = doc(receiverListCollectionRef, currentUser.email);
      await setDoc(newReceiverDocRef, receiverChatlistPayload);
  
      // Clear input fields and state
      setText('');
      setImages([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim()) { 
        handleSend(); 
      }
      setText("");
    } else if (e.key === 'Enter' && e.shiftKey) {
      setText((prevText) => prevText + '\n');
    }
  };

  const handleSendClick = () => {
    const nonWhitespaceText = /\S/.test(text);
  
    if (nonWhitespaceText) {
      handleSend();
      setText("");
    }
  };

  const handleAddEmoji = (emojiObject) => {
    const updatedText =
      text.substring(0, cursorPosition) + emojiObject.emoji + text.substring(cursorPosition);
    setText(updatedText);
    setCursorPosition(cursorPosition + emojiObject.emoji.length);
  };
  
  const toggleEmojiBox = () => {
    setOpenEmojiBox(!openEmojiBox);
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length <= 10) {
      setFileToggler(false)
      setImages(selectedFiles);
    } else {
      alert("You can't select more than 10 files");
      return;
    }
  };

  return (
    <div className="flex flex-col">
      {images.length 
        ? 
        <ImageUploader 
          currentUser={currentUser} 
          emailId={emailId}
          images={images}
          setImages={setImages}
          handleSend={handleSend}
        />
        :
        <div className="text-black flex w-full items-center justify-between bg-light py-3">
          <div className="w-[8%] flex items-center justify-center">
            <span
              className={`flex items-center justify-center  w-[40px] h-[40px] ${
                fileToggler ? "bg-light rounded-[50%]" : "null"
              }`}
            >
              <FontAwesomeIcon
                // ref={fileTogglerRef}
                icon={faPlus}
                className={`${fileToggler ? "rotate-45" : null}`}
                onClick={() => setFileToggler(!fileToggler)}
              />
            </span>

            {fileToggler && (
              <div className="toggle-div absolute left-5 bottom-[60px] flex flex-col w-[220px] py-2 space-y-3 rounded-md z-10 text-white">
                <label className="flex gap-x-3 cursor-pointer">
                  <FontAwesomeIcon icon={faCamera} style={{ color: "blue" }} /> Photos and Videos
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                    multiple
                  />
                </label>
              </div>
            )}
          </div>
          <div className="absolute bottom-20 left-20" id="emoji-picker">
            {openEmojiBox && (
              <Picker onEmojiClick={handleAddEmoji}/>
            )}
          </div>
          <div className="w-[84%] flex items-center justify-between bg-light rounded-[7px] opacity-70">
            <span className="w-[4%] ml-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 600 500"
                ref={emojiPickerRef}
                onClick={toggleEmojiBox}
                className="min-w-[30px] min-h-[30px]"
              >
                <path 
                  d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 
                  0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 
                  32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32
                  14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 
                  8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Type a message"
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onSelect={(e) => setCursorPosition(e.target.selectionStart)}
              className="w-full h-[40px] px-5 bg-transparent text-white outline-none"
            />
          </div>
          <div className="svg w-[8%] flex items-center justify-center">
            <button 
              onClick={handleSendClick}
              className={`cursor-pointer h-[45px] w-[45px] rounded-[36px] ${text !== '' ? "bg-green rotate-btn flex items-center justify-center" : null}`}
            >
              <AiOutlineSend />
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default Input;
