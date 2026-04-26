const Message = require('../models/Message');
const User = require('../models/User');

const chatController = {
  /**
   * Send a message
   */
  sendMessage: async (req, res) => {
    try {
      const { receiverId, text } = req.body;
      const senderId = req.user.id;

      const newMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        text
      });

      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get messages for a specific conversation
   */
  getConversation: async (req, res) => {
    try {
      const { otherUserId } = req.params;
      const userId = req.user.id;

      const messages = await Message.find({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId }
        ]
      }).sort({ createdAt: 1 });

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get all conversations for a manager/admin
   * Shows unique users who have messaged the manager
   */
  getAdminConversations: async (req, res) => {
    try {
      const adminId = req.user.id;
      
      // Find all unique senders who sent messages to this admin
      const messages = await Message.find({ receiver: adminId })
        .populate('sender', 'name email role')
        .sort({ createdAt: -1 });

      // Group by sender to get unique conversations
      const conversations = [];
      const seenSenders = new Set();

      for (const msg of messages) {
        if (!seenSenders.has(msg.sender._id.toString())) {
          seenSenders.add(msg.sender._id.toString());
          conversations.push({
            user: msg.sender,
            lastMessage: msg.text,
            time: msg.createdAt,
            unread: !msg.isRead
          });
        }
      }

      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Mark messages as read
   */
  markAsRead: async (req, res) => {
    try {
      const { senderId } = req.params;
      const receiverId = req.user.id;

      await Message.updateMany(
        { sender: senderId, receiver: receiverId, isRead: false },
        { $set: { isRead: true } }
      );

      res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = chatController;
