import React, { useState } from 'react';
import Chat from './Chat';
import ChatList from './ChatList';
import './Messaging.css';

const Messaging = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectChat = (user) => {
    setSelectedChat(user);
  };

  return (
    <div className="messaging-container">
      <ChatList onSelectChat={handleSelectChat} />
      {selectedChat ? (
        <Chat
          receiverId={selectedChat._id}
          receiverName={selectedChat.name}
        />
      ) : (
        <div className="no-chat-selected">
          <h2>Select a conversation to start messaging</h2>
        </div>
      )}
    </div>
  );
};

export default Messaging; 