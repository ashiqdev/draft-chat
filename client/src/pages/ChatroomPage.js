import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

const ChatroomPage = ({ match, socket }) => {
  const chatroomId = match.params.id;
  const messageRef = useRef();
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [messagesOfDb, setMessagesOfDb] = useState([]);

  const sendMessage = () => {
    console.log('function called');
    console.log({ socket });
    if (socket) {
      socket.emit('chatroomMessage', {
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = '';
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('CC_Token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.id);
    }
    if (socket) {
      socket.on('newMessage', (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
    //eslint-disable-next-line
  }, [messages, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinRoom', { chatroomId });
    return () => {
      if (!socket) return;
      socket.emit('leaveRoom', { chatroomId });
    };
  }, [socket]); //<== here

  useEffect(() => {
    axios
      .get(`http://localhost:8000/messages/${chatroomId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('CC_Token'),
        },
      })
      .then((response) => {
        setMessagesOfDb(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div className='chatroomPage'>
      <div className='chatroomSection'>
        <div className='cardHeader'>Chatroom Name</div>
        <div className='chatroomContent'>
          {/* show messages from db */}
          {messagesOfDb?.length > 0 &&
            messagesOfDb.map((message) => (
              <div key={message._id} className='message'>
                <span
                  className={
                    userId === message.user._id ? 'ownMessage' : 'otherMessage'
                  }
                >
                  {message.user.name}
                </span>
                {message.message}
              </div>
            ))}

          {/* show real time messages */}
          {messages.map((message, i) => (
            <div key={i} className='message'>
              <span
                className={
                  userId === message.userId ? 'ownMessage' : 'otherMessage'
                }
              >
                {message.name}:
              </span>{' '}
              {message.message}
            </div>
          ))}
        </div>
        <div className='chatroomActions'>
          <div>
            <input
              type='text'
              name='message'
              placeholder='Say something!'
              ref={messageRef}
            />
          </div>
          <div>
            <button className='join' onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChatroomPage);
