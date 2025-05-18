const express = require('express');
// mergeParams allows us to access params from parent router (e.g. :lotId from parkingLot.routes.js)
const router = express.Router({ mergeParams: true });
const {
    createParkingSpot,
    getParkingSpotsForLot,
    getParkingSpot, // Can also have a GET /api/spots/:id if needed for direct access
    updateParkingSpot,
    deleteParkingSpot
} = require('../controllers/parkingSpot.controller');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getParkingSpotsForLot);
// If you want a direct /api/spots/:spotId route, you'd make a separate router or add it here with a check
router.get('/:spotId', getParkingSpot);


// Admin routes (or lot owner)
router.post('/', protect, authorize('admin'), createParkingSpot);
router.put('/:spotId', protect, authorize('admin'), updateParkingSpot); // Authorization inside controller
router.delete('/:spotId', protect, authorize('admin'), deleteParkingSpot); // Authorization inside controller


module.exports = router;