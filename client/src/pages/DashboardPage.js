import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [chatrooms, setchatrooms] = useState([]);

  const getChatRooms = () => {
    axios
      .get('http://localhost:8000/chatroom', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('CC_Token'),
        },
      })
      .then((response) => {
        setchatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatRooms, 3000);
      });
  };

  useEffect(() => {
    getChatRooms();
  }, []);
  return (
    <div className='card'>
      <div className='cardHeader'>Chatrooms</div>

      <div className='cardBody'>
        <div className='inputGroup'>
          <label htmlFor='chatroomName'>Chatroom Name</label>
          <input
            type='text'
            name='chatroomName'
            id='chatroomName'
            placeholder='ChatterBox'
          />
        </div>

        <button>Create ChatRoom</button>

        <div className='chatrooms'>
          {chatrooms.map((chatroom) => (
            <div key={chatroom._id} className='chatroom'>
              <div>{chatroom.name}</div>
              <Link to={`/chatroom/${chatroom._id}`}>
                <div className='join'>Join</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
