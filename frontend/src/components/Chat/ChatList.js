import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './ChatList.css';

const ChatList = ({ onSelectChat }) => {
  const [conversations, setConversations] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/messages/conversations`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="chat-list">
      <h2>Conversations</h2>
      <div className="conversations">
        {conversations.map((conversation) => (
          <div
            key={conversation._id}
            className="conversation-item"
            onClick={() => onSelectChat(conversation.user)}
          >
            <div className="conversation-info">
              <h4>{conversation.user.name}</h4>
              <p>{conversation.lastMessage?.content || 'No messages yet'}</p>
            </div>
            <div className="conversation-meta">
              <span className="time">
                {conversation.lastMessage
                  ? new Date(conversation.lastMessage.createdAt).toLocaleTimeString()
                  : ''}
              </span>
              {conversation.unreadCount > 0 && (
                <span className="unread-badge">{conversation.unreadCount}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList; 