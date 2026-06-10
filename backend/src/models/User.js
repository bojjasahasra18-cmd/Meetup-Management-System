/**
 * src/models/User.js
 * Mongoose schema and model for the User entity.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },

    profession: {
      type: String,
      default: '',
    },

    company: {
      type: String,
      default: '',
    },

    lookingFor: {
      type: String,
      default: '',
    },

    linkedin: {
  type: String,
  default: '',
},

portfolio: {
  type: String,
  default: '',
},

bio: {
  type: String,
  default: '',
},

    profilePicture: {
      type: String,
      default: '',
    },

  role: {
  type: String,
  enum: ['user', 'organizer', 'admin'],
  default: 'user',
},

points: {
  type: Number,
  default: 0,
},

badges: {
  type: [String],
  default: [],
},


    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);