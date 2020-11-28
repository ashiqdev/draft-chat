const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: 'Name is required',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
