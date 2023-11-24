import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faMessage, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import DataContext from '../context/DataContext';
import { auth } from '../firebase/Firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';
import SearchUser from './SearchUser';
import { useNavigate } from 'react-router-dom';
import ChatList from './ChatList';

const Sidebar = () => {
  const navigate = useNavigate();
  const { sidebarToggler, setSidebarToggler } = useContext(DataContext);
  const { currentUser } = useContext(AuthContext);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-w-[30%] h-full border-gray-600 border-r-[0.2px]">
      <div className="min-h-[70px] relative bg-light flex w-full justify-between items-center">
        <span className="w-[20%] flex items-center justify-center">
          <img src={currentUser.photoURL} alt="" className="w-[40px] h-[40px] rounded-[50%]" />
        </span>
        <span className="w-[40%] flex items-center justify-between pr-5">
          <FontAwesomeIcon icon={faUserGroup} />
          <FontAwesomeIcon icon={faMessage} />
          <span className={`flex items-center justify-center  w-[40px] h-[40px] ${sidebarToggler ? "bg-light rounded-[50%]" : "null"}`}>
            <FontAwesomeIcon 
              icon={faEllipsis} 
              className="rotate-90" 
              onClick={() => setSidebarToggler(!sidebarToggler)}
            />
          </span>
        </span>
        {sidebarToggler && (
          <div className="toggle-div absolute right-9 top-[68px] flex flex-col w-[200px] py-2 space-y-3 rounded-md">
            <span>New group</span>
            <span>Select chats</span>
            <span>Settings</span>
            <span onClick={handleSignOut}>Log out</span>
          </div>
        )}
      </div>
      <SearchUser />
      <ChatList />
    </div>
  );
};

export default Sidebar;
