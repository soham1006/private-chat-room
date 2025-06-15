const Message = require("./models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinRoom", async ({ roomId, username }) => {
      socket.join(roomId);
      console.log(`${username} joined room ${roomId}`);

      try {
        const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
        messages.forEach((msg) => {
          socket.emit("receiveMessage", {
            message: msg.message,
            username: msg.username,
            timestamp: msg.timestamp.toISOString(),
          });
        });
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    });

    socket.on("sendMessage", async ({ roomId, message, username, timestamp }) => {
      const time = new Date(timestamp);

      io.to(roomId).emit("receiveMessage", {
        message,
        username,
        timestamp: time.toISOString(),
      });

      try {
        await Message.create({
          roomId,
          message,
          username,
          timestamp: time,
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("typing", ({ roomId, username }) => {
      socket.to(roomId).emit("showTyping", { username });
    });

    socket.on("stopTyping", ({ roomId }) => {
      socket.to(roomId).emit("hideTyping");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
