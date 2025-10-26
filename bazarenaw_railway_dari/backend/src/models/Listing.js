const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ListingSchema = new Schema({
  title: String,
  description: String,
  price: String,
  location: String,
  category: String,
  imageUrl: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  approved: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Listing', ListingSchema)
