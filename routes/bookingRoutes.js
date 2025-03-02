const express = require('express');
const { 
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  getUserBookingsById
} = require('../controllers/bookingController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');
const router = express.Router();

// User routes
router.post('/', isAuthenticated, createBooking);
router.get('/user', isAuthenticated, getUserBookings);

// Admin routes
router.get('/admin', isAuthenticated, isAdmin, getAllBookings);
router.get('/user/:userId', isAuthenticated, isAdmin, getUserBookingsById);
router.put('/:id/status', isAuthenticated, isAdmin, updateBookingStatus);

module.exports = router;