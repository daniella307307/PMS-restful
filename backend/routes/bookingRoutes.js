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
/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parkingLotId
 *               - startTime
 *               - endTime
 *             properties:
 *               parkingLotId:
 *                 type: integer
 *               parkingSpotId:
 *                 type: integer
 *               vehicleId:
 *                 type: integer
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error or booking conflict
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/bookings/my-bookings:
 *   get:
 *     summary: Get bookings for the logged-in user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [confirmed, cancelled, completed, active, expired]
 *       - in: query
 *         name: upcoming
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       200:
 *         description: List of user bookings
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get details of a specific booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details retrieved
 *       404:
 *         description: Booking not found
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Cancel a confirmed booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Cannot cancel booking
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: parkingLotId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [confirmed, cancelled, completed, active, expired]
 *     responses:
 *       200:
 *         description: List of all bookings
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Update booking status (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, active, completed, cancelled, expired]
 *     responses:
 *       200:
 *         description: Booking status updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */


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