const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    pet: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Pet',
      required: true 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);