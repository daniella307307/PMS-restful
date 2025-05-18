const express = require('express');
const router = express.Router();
const {
    createParkingLot,
    getParkingLots,
    getParkingLot,
    updateParkingLot,
    deleteParkingLot
} = require('../controllers/parkingLot.controller');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getParkingLots);
router.get('/:id', getParkingLot);

// Admin routes
router.post('/', protect, authorize('admin'), createParkingLot);
router.put('/:id', protect, authorize('admin'), updateParkingLot); // Or check owner inside controller
router.delete('/:id', protect, authorize('admin'), deleteParkingLot); // Or check owner inside controller

module.exports = router;