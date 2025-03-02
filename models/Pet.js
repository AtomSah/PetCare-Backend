const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true }, // Cat, Dog, etc.
    breed: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    weight: { type: String, required: true },
    color: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    vaccinated: { type: Boolean, default: false },
    image: { type: String, required: true },
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pet', PetSchema);