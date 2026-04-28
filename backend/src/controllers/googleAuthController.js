const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { name, email, picture, sub: googleId } = payload;
    const normalizedEmail = email.toLowerCase().trim();

    // Find existing user or create new one
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      // First-time Google user → create with RENTER role by default
      user = await User.create({
        name,
        email: normalizedEmail,
        passwordHash: `GOOGLE_${googleId}`, // No password needed for Google users
        role: 'RENTER',
        authProvider: 'google'
      });
      console.log(`[Google Auth] New user created: ${normalizedEmail}`);
    }

    const token = generateToken(user._id);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('[Google Auth] Error:', error.message);
    res.status(401).json({ error: 'Google authentication failed. Please try again.' });
  }
};
