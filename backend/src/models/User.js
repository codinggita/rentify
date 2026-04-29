const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  role: { 
    type: String, 
    enum: ['RENTER', 'OWNER', 'INSPECTOR', 'SERVICE', 'ADMIN'], 
    default: 'RENTER' 
  },
  phone: { type: String },
  rating: { type: Number, default: 4.5 },
  authProvider: { type: String, enum: ['local', 'google', 'email-otp', 'phone'], default: 'local' },
}, { timestamps: true });

userSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName || ''}`.trim();
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
