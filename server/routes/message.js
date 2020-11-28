const router = require('express').Router();
const { catchErrors } = require('../handlers/errorHandler');
const messageController = require('../controllers/messageController');

// get messages of a chatroom
router.get('/:id', catchErrors(messageController.getMessages));

module.exports = router;
