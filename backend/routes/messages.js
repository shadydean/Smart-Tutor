const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// Get all conversations for the current user
router.get('/conversations', protect, async (req, res) => {
  try {
    // Get all unique users the current user has chatted with
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name')
      .populate('receiver', 'name');

    // Group messages by conversation partner
    const conversations = messages.reduce((acc, message) => {
      const otherUser = message.sender._id.toString() === req.user.id
        ? message.receiver
        : message.sender;

      if (!acc[otherUser._id]) {
        acc[otherUser._id] = {
          _id: otherUser._id,
          user: otherUser,
          lastMessage: message,
          unreadCount: message.receiver._id.toString() === req.user.id && !message.read ? 1 : 0
        };
      } else if (!acc[otherUser._id].lastMessage || message.createdAt > acc[otherUser._id].lastMessage.createdAt) {
        acc[otherUser._id].lastMessage = message;
      }
      if (message.receiver._id.toString() === req.user.id && !message.read) {
        acc[otherUser._id].unreadCount++;
      }
      return acc;
    }, {});

    res.json(Object.values(conversations));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all messages between two users
router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 })
      .populate('sender', 'name')
      .populate('receiver', 'name');
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a new message
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      content
    });
    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name')
      .populate('receiver', 'name');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/read/:userId', protect, async (req, res) => {
  try {
    await Message.updateMany(
      {
        receiver: req.user.id,
        sender: req.params.userId,
        read: false
      },
      { read: true }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 