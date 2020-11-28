import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Messages = () => {
  const [messagesOfDb, setMessagesOfDb] = useState('');

  console.log(messagesOfDb);
  useEffect(() => {
    axios
      .get(`http://localhost:8000/messages/5fc0ed1c9b8df8394cdc39eb`, {
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
    <div>
      {messagesOfDb &&
        messagesOfDb.map((message) => {
          return <p>{message.message}</p>;
        })}
    </div>
  );
};

export default Messages;
