const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  phone:    { type: String, unique: true, sparse: true, default: '' },
  email:    { type: String, unique: true, sparse: true, lowercase: true },
  password: { type: String, minlength: 6, select: false },
  role:     { type: String, enum: ['user','admin'], default: 'user' },
  address:  String,
  city:     { type: String, default: 'Gorakhpur' },
  pincode:  String,
  profilePicture: String,
  googleId: { type: String, unique: true, sparse: true },
  isGoogleUser: { type: Boolean, default: false },

  // Social links (admin ke liye)
  socialLinks: {
    instagram: String,
    youtube:   String,
    facebook:  String,
    whatsapp:  String,
  },

  // Loyalty coins
  coinBalance: { type: Number, default: 0 },

  // Bank details
  bankDetails: {
    accountName: String, accountNumber: String,
    ifscCode: String, bankName: String,
  },

  notifications: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function(entered) {
  if (!this.password) return false;
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
