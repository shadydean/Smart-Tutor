const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// Get all conversations for current user
router.get('/', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate('participants', 'name role profileImage')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
    
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread messages count
router.get('/unread-count', protect, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      recipient: req.user.id,
      read: false
    });
    res.json({ count: unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages for a conversation
router.get('/:conversationId/messages', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is part of the conversation
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view these messages' });
    }

    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        recipient: req.user.id,
        read: false
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new conversation
router.post('/', protect, async (req, res) => {
  try {
    const { tutorId } = req.body;
    
    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: {
        $all: [req.user.id, tutorId]
      }
    });
    
    if (existingConversation) {
      return res.json(existingConversation);
    }
    
    // Create new conversation
    const conversation = new Conversation({
      participants: [req.user.id, tutorId]
    });
    
    await conversation.save();
    
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name role profileImage');
    
    res.status(201).json(populatedConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message in a conversation
router.post('/:conversationId/messages', protect, async (req, res) => {
  try {
    console.log('Received message request:', {
      conversationId: req.params.conversationId,
      content: req.body.content,
      userId: req.user.id
    });

    if (!req.body.content) {
      console.log('No content provided');
      return res.status(400).json({ message: 'Message content is required' });
    }

    const { content } = req.body;
    let conversation;
    
    try {
      conversation = await Conversation.findById(req.params.conversationId)
        .populate('participants', 'name');
    } catch (err) {
      console.error('Error finding conversation:', err);
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }
    
    if (!conversation) {
      console.log('Conversation not found:', req.params.conversationId);
      return res.status(404).json({ message: 'Conversation not found' });
    }

    console.log('Found conversation:', {
      id: conversation._id,
      participants: conversation.participants.map(p => ({
        id: p._id,
        name: p.name
      }))
    });

    if (!conversation.participants.some(p => p._id.toString() === req.user.id.toString())) {
      console.log('User not authorized:', {
        userId: req.user.id,
        participants: conversation.participants.map(p => p._id.toString())
      });
      return res.status(403).json({ message: 'Not authorized to send messages in this conversation' });
    }

    const recipient = conversation.participants.find(
      p => p._id.toString() !== req.user.id.toString()
    );

    if (!recipient) {
      console.log('No recipient found');
      return res.status(400).json({ message: 'No recipient found for this conversation' });
    }

    console.log('Found recipient:', {
      id: recipient._id,
      name: recipient.name
    });

    const message = new Message({
      conversation: conversation._id,
      sender: req.user.id,
      recipient: recipient._id,
      content: content,
      read: false
    });

    await message.save();

    // Update conversation's last message
    conversation.lastMessage = message._id;
    conversation.updatedAt = Date.now();
    await conversation.save();

    // Populate the message with sender and recipient details
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name')
      .populate('recipient', 'name');

    console.log('Message created successfully:', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
