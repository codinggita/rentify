const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
// const auth = require('../middleware/auth');

// No auth for now to make it easy to test
router.post('/send', chatController.sendMessage);
router.get('/conversations', chatController.getAdminConversations);
router.get('/conversation/:otherUserId', chatController.getConversation);
router.patch('/read/:senderId', chatController.markAsRead);

module.exports = router;
