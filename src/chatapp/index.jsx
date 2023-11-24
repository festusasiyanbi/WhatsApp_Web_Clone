import React, { useContext } from 'react'
import Sidebar from './Sidebar'
import Chat from './Chat'
import { AuthContext } from '../context/AuthContext'
import { Route, Routes } from 'react-router-dom'

const ChatApp = () => {
  const { currentUser } = useContext(AuthContext)

  return (
    currentUser && 
      <div className="w-full flex justify-between items-start h-[100vh] text-white p-3 bg-deep">
        <Sidebar />
        <Routes>
          <Route path="/:emailId" element={<Chat />} />
        </Routes>
      </div>
  )
}
export default ChatApp
