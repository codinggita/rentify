const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendWhatsAppWelcome } = require('../services/whatsappService');

/**
 * Handle user login/registration after successful Firebase Phone Verification.
 */
exports.checkPhoneUser = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: 'Phone number not registered. Please sign up first.' });
    }

    res.json({ message: 'User found', phone });
  } catch (error) {
    res.status(500).json({ error: 'Server error during phone check' });
  }
};

/**
 * Handle user login after successful Firebase Phone Verification.
 */
exports.phoneLogin = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });

    // Find user
    let user = await User.findOne({ phone: phone });

    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    const token = generateToken(user._id);
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token,
      isNewUser: false
    });
  } catch (error) {
    console.error('[Phone Auth] Login error:', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
