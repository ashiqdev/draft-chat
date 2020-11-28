const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: 'Message is required',
    },
    chatroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
