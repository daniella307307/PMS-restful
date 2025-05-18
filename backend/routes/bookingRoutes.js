const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getBooking,
    cancelBooking,
    updateBookingStatusByAdmin,
    getAllBookings
} = require('../controllers/bookingController');


const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // All booking routes are protected

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);

router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

// Admin specific routes for bookings
router.get('/', authorize('admin'), getAllBookings);
router.put('/:id/status', authorize('admin'), updateBookingStatusByAdmin);

module.exports = router;