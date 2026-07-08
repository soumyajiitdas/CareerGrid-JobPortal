const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedbackModel');
const { optionalProtect } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/email');

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
    
    // Send feedback email to the admin
    if (process.env.EMAIL_FEEDBACK) {
      try {
        await sendEmail({
          email: process.env.EMAIL_FEEDBACK,
          subject: `New Feedback from ${name}`,
          message: `You have received a new feedback.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>New Feedback Received</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; margin-left: 0; color: #555;">
                ${message}
              </blockquote>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send feedback email:', emailError);
      }
    }

    res.status(201).json(createdFeedback);
  } catch (error) {
    res.status(400).json({ message: 'Failed to save feedback' });
  }
});

module.exports = router;
