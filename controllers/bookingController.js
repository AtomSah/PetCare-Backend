const Booking = require('../models/Booking');
const Pet = require('../models/Pet');

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    // Verify user exists
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const bookings = await Booking.find()
      .populate('pet')
      .populate('user', 'name email phone')
      .sort('-createdAt');
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    // Verify user exists
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { petId, name, contact, address } = req.body;
    
    // Check if petId is provided
    if (!petId) {
      return res.status(400).json({ message: 'Pet ID is required' });
    }
    
    // Check if pet exists and is available
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    if (!pet.available) {
      return res.status(400).json({ message: 'This pet is no longer available' });
    }
    
    // Create booking
    const booking = await Booking.create({
      pet: petId,
      user: req.user.id,
      name,
      contact,
      address,
      status: 'pending'
    });
    
    // Update pet availability
    pet.available = false;
    await pet.save();
    
    res.status(201).json({ 
      message: 'Booking created successfully', 
      booking,
      contactNumber: '987654321' // Your contact number for follow-up
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    // Verify user exists
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const bookings = await Booking.find({ user: req.user.id })
      .populate('pet')
      .sort('-createdAt');
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update booking status (admin only)
const updateBookingStatus = async (req, res) => {
  try {
    // Verify user exists
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    ).populate('pet');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // If booking is cancelled, make pet available again
    if (status === 'cancelled' && booking.pet) {
      await Pet.findByIdAndUpdate(booking.pet._id, { available: true });
    }
    
    res.status(200).json({ message: 'Booking status updated', booking });
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserBookingsById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { userId } = req.params;
    
    const bookings = await Booking.find({ user: userId })
      .populate('pet')
      .sort('-createdAt');
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error in getUserBookingsById:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  getUserBookingsById,
};