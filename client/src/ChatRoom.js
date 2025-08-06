import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { decrypt, encrypt } from "./utils/cryptoUtils";

const socket = io("https://vaulttalk.onrender.com");

function ChatRoom({ username, roomId }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");
  let typingTimeout = null;

  useEffect(() => {
    socket.emit("joinRoom", { roomId, username });

    socket.on("receiveMessage", ({ message, username, timestamp }) => {
      const decrypted = decrypt(message);
      setMessages((prev) => [
        ...prev,
        { text: decrypted, username, timestamp },
      ]);
    });

    socket.on("showTyping", ({ username }) => {
      setTyping(`${username} is typing...`);
    });

    socket.on("hideTyping", () => setTyping(""));

    return () => {
      socket.off("receiveMessage");
      socket.off("showTyping");
      socket.off("hideTyping");
    };
  }, [roomId, username]);

  const handleSend = () => {
    if (!input.trim()) return;

    const timestamp = new Date().toISOString();
    const encrypted = encrypt(input);

    socket.emit("sendMessage", {
      roomId,
      message: encrypted,
      username,
      timestamp,
    });

    setInput("");
    socket.emit("stopTyping", { roomId });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    socket.emit("typing", { roomId, username });

    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { roomId });
    }, 1000);
  };

  return (
    <div className="chat-container">
      <h2>Room: {roomId}</h2>
      <div className="messages">
        {messages.map((msg, i) => (
          <p
            key={i}
            className={msg.username === username ? "self-msg" : "other-msg"}
          >
            <strong>{msg.username}</strong>: {msg.text}
            <br />
            <small>
              {msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString()
                : "No time"}
            </small>
          </p>
        ))}
      </div>
      {typing && <div className="typing">{typing}</div>}
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Type a message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatRoom;
