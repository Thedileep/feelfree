const express = require('express');
const router = express.Router();
const Message = require('../models/chat');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const { chatStorage, chatFileFilter } = require('../cloudinary');
const { body, param, validationResult } = require('express-validator');

const upload = multer({ storage: chatStorage, fileFilter: chatFileFilter });

// ✅ Get messages for a booking
router.get(
  '/messages/:bookingId',
  authMiddleware,
  param('bookingId').isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const messages = await Message.find({ bookingId: req.params.bookingId })
        .sort('createdAt')
        .lean();
      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ✅ Send text message
router.post(
  '/messages/:bookingId',
  authMiddleware,
  param('bookingId').isMongoId(),
  body('text').trim().notEmpty().withMessage('Message cannot be empty'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { text } = req.body;
      const message = new Message({
        bookingId: req.params.bookingId,
        text,
        sender: req.user.id,
        deletedFor: [], // initialize empty
      });
      await message.save();

      req.app.get('io')?.to(req.params.bookingId).emit('message', message);
      res.json(message);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ✅ Upload media (image/audio/video)
router.post(
  '/messages/:bookingId/media',
  authMiddleware,
  upload.single('file'),
  param('bookingId').isMongoId(),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    try {
      const messageData = { bookingId: req.params.bookingId, sender: req.user.id, deletedFor: [] };

      if (req.file.mimetype.startsWith('image/')) messageData.image = req.file.path;
      else if (req.file.mimetype.startsWith('audio/')) messageData.audio = req.file.path;
      else if (req.file.mimetype.startsWith('video/')) messageData.video = req.file.path;
      else return res.status(400).json({ message: 'Invalid media type' });

      const message = new Message(messageData);
      await message.save();

      req.app.get('io')?.to(req.params.bookingId).emit('message', message);
      res.json(message);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ✅ Delete single message
router.delete(
  '/messages/:messageId',
  authMiddleware,
  param('messageId').isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { forEveryone } = req.body;

    try {
      const message = await Message.findById(req.params.messageId);
      if (!message) return res.status(404).json({ message: 'Message not found' });

      // Security check
      if (!forEveryone && message.sender.toString() !== req.user.id)
        return res.status(403).json({ message: 'Unauthorized' });

      if (forEveryone) {
        await message.remove();
        req.app.get('io')?.to(message.bookingId).emit('deleteMessage', message._id);
      } else {
        // Delete for this user only
        if (!message.deletedFor.includes(req.user.id)) {
          message.deletedFor.push(req.user.id);
          await message.save();
        }
        req.app.get('io')?.to(message.bookingId).emit('deleteMessageForUser', {
          messageId: message._id,
          userId: req.user.id,
        });
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ✅ Clear chat for user
router.post(
  '/messages/:bookingId/clear',
  authMiddleware,
  param('bookingId').isMongoId(),
  async (req, res) => {
    try {
      await Message.updateMany(
        { bookingId: req.params.bookingId },
        { $addToSet: { deletedFor: req.user.id } }
      );
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
