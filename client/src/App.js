// App.js
import React, { useState } from "react";
import ChatRoom from "./ChatRoom";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (username.trim() && roomId.trim()) {
      setJoined(true);
    }
  };

  if (joined) {
    return <ChatRoom username={username} roomId={roomId} />;
  }

  return (
    <div className="join-container">
      <h1>🔒 Private Room Chat</h1>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
}

export default App;
