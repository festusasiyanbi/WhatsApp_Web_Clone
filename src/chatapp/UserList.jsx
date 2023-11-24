import React from 'react'
import { useNavigate } from 'react-router-dom';

const UserList = ({ users, setUsers, setSearchName }) => {
    const navigate = useNavigate();

    const handleSelect = (user) => {
        navigate(`/${user.email}`);
        setUsers([]);
        setSearchName('');
    };
    return (
        users.length > 0 && (
            <div className="search-results w-full flex flex-col items-center justify-start mt-2 space-y-5">
            {users.map((user) => (
                <div
                className="userChat w-full flex items-center space-x-5 cursor-pointer"
                key={user.uid}
                onClick={() => handleSelect(user)}
                >
                <span className="w-[10%]">
                    <img
                    src={user.photoURL}
                    alt=""
                    className="w-[40px] h-[40px] rounded-[50%]"
                    />
                </span>
                <div className="userChatInfo border-gray-500 border-b-[0.3px] w-[85%] py-2 flex flex-col">
                    <span className="w-full flex justify-between items-center pr-5">
                    <span>{user.displayName}</span>
                    <span className="text-xs text-gray-400"></span>
                    </span>
                    <span className="text-sm text-gray-400"></span>
                </div>
                </div>
            ))}
            </div>
        )
    )
}

export default UserList