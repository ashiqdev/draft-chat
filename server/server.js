const mongoose = require('mongoose');
const jwt = require('jwt-then');
mongoose.connect(process.env.DATABASE, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose Connection Error ` + err.message);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connected!');
});

// Bring in the models
require('./models/User');
require('./models/ChatRoom');
require('./models/Message');

const app = require('./app');

const Message = mongoose.model('Message');
const User = mongoose.model('User');

const port = 8000;

const server = app.listen(port, () => {
  console.log('server is listning on port 8000');
});

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.SECRET);
    socket.userId = payload.id;
    next();
  } catch (err) {}
});

io.on('connection', (socket) => {
  // console.log('Connected: ' + socket.userId);

  socket.on('disconnect', () => {
    console.log('Disconnected: ' + socket.userId);
  });

  socket.on('joinRoom', ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log(`A user joined in chatroom ${chatroomId}`);
  });

  socket.on('leaveRoom', ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log(`A user left from chatroom ${chatroomId}`);
  });

  socket.on('chatroomMessage', async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });
      const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userId,
        message,
      });
      io.to(chatroomId).emit('newMessage', {
        message,
        name: user.name,
        userId: socket.userId,
      });

      await newMessage.save();
    }
  });
});
