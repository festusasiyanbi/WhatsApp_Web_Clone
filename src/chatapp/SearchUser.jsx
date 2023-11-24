import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { BsFilter } from 'react-icons/bs';
import {
  collection,
  query,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase/Firebase';
import UserList from './UserList';
import ChatList from './ChatList';

const Search = () => {
  const [chats, setChats] = useState([])
  const [searchName, setSearchName] = useState('');
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const getUsers = async () => {
      if (searchName) {
        try {
          const q = query(collection(db, 'users'));
          const querySnapshot = await getDocs(q);
          const foundUsers = querySnapshot.docs.map((doc) => doc.data());
          const filteredUsers = foundUsers
            .filter((user) => user.displayName.toLowerCase().includes(searchName.toLowerCase()))
            .filter((user) => user.uid !== currentUser.uid);
          setUsers(filteredUsers);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      } else {
        setUsers([]);
      }
    };
    const getChats = async () => {
      try {
        const chatListRef = collection(db, 'chatlist', currentUser.email, 'list');
        if (!chatListRef) { return; }
        else {
          const unsubscribe = onSnapshot(chatListRef, (snapshot) => {
            const chats = snapshot.docs.map((doc) => doc.data());
            setChats(chats);
          });
          return unsubscribe;
        }
      } catch (error) {
        console.error(error)
      }
    };

    getChats();
    getUsers();
  }, [searchName, currentUser.email]);

  return (
    <div className="w-full flex items-center justify-between px-3 h-fit pt-2 flex-col">
      <div className="w-full flex items-center justify-between">
        <div className="bg-light w-[90%] rounded-[7px] px-2 flex items-center">
          <FontAwesomeIcon icon={faSearch} className="pr-5" />
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="bg-transparent text-light py-2 text-sm w-[90%] outline-none border-none"
            name="searchuser"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <BsFilter className="bg-transparent mr-1 w-[7%] text-[50px]" />
      </div>
      {searchName && !users.length ? (
        searchName.toLowerCase() === currentUser.displayName.toLowerCase() ? (
          <p className="pt-10">No other user found with the name "{searchName}" except you.</p>
        ) : (
              <p className="pt-10">No user found with the name "{searchName}"</p>
        ))  : ( null)
      }
      {users && (
        <UserList 
          users={users} 
          setUsers={setUsers}
          setSearchName={setSearchName}
        />
      )}
      {chats && (
        <ChatList 
          chats={chats}
          setChats={setChats}
        />
      )}
    </div>
  );
};

export default Search;
