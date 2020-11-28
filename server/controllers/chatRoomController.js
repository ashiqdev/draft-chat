const mongoose = require('mongoose');
const ChatRoom = mongoose.model('ChatRoom');

exports.createChatRoom = async (req, res) => {
  const { name } = req.body;

  const chatRoomExists = await ChatRoom.findOne({ name });
  if (chatRoomExists) throw 'ChatRoom with that name already exists';

  const chatroom = new ChatRoom({ name });

  await chatroom.save();

  res.json({
    message: 'ChatRoom created!',
  });
};

exports.getAllChatrooms = async (req, res) => {
  const chatrooms = await ChatRoom.find({});
  res.json(chatrooms);
};
