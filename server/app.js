const express = require('express');
const cors = require('cors');
const app = express();
const errorHandlers = require('./handlers/errorHandler');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// bring in the routes
app.use('/user', require('./routes/user'));
app.use('/chatroom', require('./routes/chatRoom'));
app.use('/messages', require('./routes/message'));

// setup error handlers
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if (process.env.ENV === 'DEVELOPMENT') {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

module.exports = app;
