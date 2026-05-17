const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedbackModel');
const { optionalProtect } = require('../middleware/authMiddleware');

router.post('/', optionalProtect, async (req, res) => {
  const { name, email, message } = req.body;

  const feedback = new Feedback({
    user: req.user ? req.user._id : null,
    name,
    email,
    message,
  });

  try {
    const createdFeedback = await feedback.save();
    res.status(201).json(createdFeedback);
  } catch (error) {
    res.status(400).json({ message: 'Failed to save feedback' });
  }
});

module.exports = router;
