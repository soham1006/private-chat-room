const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

router.post("/create", async (req, res) => {
  const { name, username } = req.body;
  const room = new Room({ name, members: [username] });
  await room.save();
  res.status(201).json({ roomId: room._id });
});

router.post("/join", async (req, res) => {
  const { roomId, username } = req.body;
  const room = await Room.findById(roomId);
  if (!room.members.includes(username)) room.members.push(username);
  await room.save();
  res.json({ message: "Joined" });
});

module.exports = router;