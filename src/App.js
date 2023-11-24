import React from "react";
import { useContext } from "react";
import Login from "./auth/Login";
import ChatApp from "./chatapp";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="App w-full">
      {currentUser ? (
        <ChatApp />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;