const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  verified: { type: Boolean, default: false },
  verifyToken: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
