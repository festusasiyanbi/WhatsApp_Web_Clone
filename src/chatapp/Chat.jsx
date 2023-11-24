import React, { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEllipsis, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/Firebase';
import { AuthContext } from '../context/AuthContext';
import DataContext from '../context/DataContext';
import Input from './Input';
import Messages from './Messages';

const Chat = () => {
  const { emailId } = useParams();
  const navigate = useNavigate();
  const chatBoxRef = useRef(null);
  const scrollToRef = useRef(null);
  const chatContainerRef = useRef(null);

  const { currentUser } = useContext(AuthContext);
  const {
    chatappToggler,
    setChatappToggler,
    chatSidebarToggler,
    setChatSidebarToggler,
  } = useContext(DataContext);

  const [chatUser, setChatUser] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([])
  const [focus, setFocus] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', emailId));

      try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size === 0) {
          // No user found with the specified emailId
          return;
        }

        // Assuming there should be only one user with the given emailId
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setChatUser(userData);
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const getMessages = async () => {
      const chatRef = doc(db, 'chats', emailId);
      const messagesCollectionRef = collection(chatRef, 'messages');
      const messagesQuery = query(messagesCollectionRef, orderBy('timeStamp', 'asc'));

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messages = snapshot.docs.map((doc) => doc.data());

        const newMessage = messages.filter(
          (message) =>
            message.senderEmail === (currentUser.email || emailId) ||
            message.receiverEmail === (currentUser.email || emailId)
        );

        setMessages(newMessage);
      });

      // Unsubscribe from the snapshot listener when the component unmounts
      return unsubscribe;
    };

    const searchMessages = () => {
      if (searchQuery) {
        // Use the filter method to find messages that match the search query
        const filteredMessages = messages.filter((message) =>
          message.text?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    
        // Update the state with the filtered messages
        setFilteredMessages(filteredMessages);
      } else {
        // If there is no search query, clear the filteredMessages state
        setFilteredMessages([]);
      }
    };
    

    getUser();
    getMessages();
    searchMessages()
  }, [emailId, currentUser, searchQuery]);

  useEffect(() => {
    // Scroll to the bottom of the chat container when chatMessages change
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, scrollToRef]);

  const searchAndHighlight = (text, searchQuery) => {
    // Create a regular expression with the searchQuery and the 'gi' flags for global and case-insensitive matching
    const regex = new RegExp(`(${searchQuery})`, 'gi');
  
    // Split the text using the regular expression and wrap matched parts in a <span> with a different class
    return text.split(regex).map((part, index) => {
      if (regex.test(part.toLowerCase())) {
        return (
          <span key={index} className="text-green font-bold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="chat-container relative w-[70%] h-full flex justify-between">
      <div className="h-full w-full flex flex-col justify-between">
        <div className="flex">
          <div className="w-full">
            <div className="chat-info min-h-[70px] relative bg-light flex justify-between items-center px-5">
              <div className="w-[40%] flex items-center space-x-5">
                <span>
                  <img src={chatUser?.photoURL} alt="" className="w-[50px] h-[50px] rounded-[50%]" />
                </span>
                <span className="flex items-center">{chatUser?.displayName}</span>
              </div>
              <div className="w-[15%] flex items-center justify-evenly">
                <span onClick={() => setChatSidebarToggler(true)}>
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <span
                  className={`flex items-center justify-center  w-[40px] h-[40px] ${
                    chatappToggler ? 'bg-light rounded-[50%]' : 'null'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faEllipsis}
                    className="rotate-90"
                    onClick={() => setChatappToggler(!chatappToggler)}
                  />
                </span>
              </div>
              {chatappToggler && (
                <div className="toggle-div absolute right-9 top-[65px] flex flex-col w-[200px] py-2 space-y-3 rounded-md z-10">
                  <span>Contact info</span>
                  <span>Select messages</span>
                  <span onClick={() => navigate('/')}>Close chat</span>
                  <span>Clear chat</span>
                  <span>Delete chat</span>
                  <span>Block</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <Messages
          messages={messages}
          setMessages={setMessages}
          chatBoxRef={chatBoxRef} 
        />
        <Input 
          emailId={emailId}
          chatUser={chatUser} 
        />
      </div>
      {chatSidebarToggler && (
        <div ref={chatContainerRef} className="w-[70%] h-full bg-lighter text-black border-gray-600 border-l-[0.2px]">
          <div className="min-h-[70px]  flex items-center justify-start bg-light">
            <span className='text-gray-200'>
              <FontAwesomeIcon 
                icon={faTimes} 
                className="px-5"
                onClick={() => setChatSidebarToggler(false)} 
              /> Search messages
            </span>
          </div>
          <div className="w-full flex items-center justify-between px-3 h-[50px]">
            <div className="bg-light w-full rounded-[7px] px-2 flex items-center text-xs">
              {focus === null && 
                <FontAwesomeIcon
                  icon={faSearch}
                  className="px-5 text-[20px]" 
                />
              }
              {focus !== null && 
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="px-5 text-green text-[20px]" 
                />
              }
              <form className="w-full">
                <input
                  type="text"
                  placeholder="Search or start a new chat"
                  className="bg-transparent text-light py-2 text-sm w-[90%] outline-none border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(null)}
                />
              </form>
              {searchQuery && 
                <FontAwesomeIcon
                  icon={faTimes} 
                  className="pl-5 text-[15px]"
                  onClick={() => setSearchQuery('')}
                />
              }
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-400 mt-3">
            {!filteredMessages.length && !searchQuery && 
              <p className='px-3'>Search messages with {chatUser.displayName}</p>
            }
            {filteredMessages && filteredMessages.map((message, index) => (
              <div 
                className='w-full flex flex-col items-start justify-center py-3 border-gray-600 
                  border-b-[0.2px] px-2 hover:bg-light cursor-pointer'
              >
                <span className="text-[14px] text-gray-500 text-left">
                  {message.timeStamp?.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <p>
                  {searchAndHighlight(message.text, searchQuery)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
