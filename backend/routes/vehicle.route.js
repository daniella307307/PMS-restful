const express = require('express');
const router = express.Router();
const {
    addVehicle,
    getMyVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicles
} = require('../controllers/vehicle.controller');
const { protect } = require('../middleware/authMiddleware'); // No admin role needed for own vehicles

router.use(protect); // All vehicle routes are protected
router.post('/', protect,addVehicle)
router.get('/',protect,getMyVehicles)
router.get('/getall',protect,getVehicles)

router.route('/:id')
    .get(getVehicle)
    .put(updateVehicle)
    .delete(deleteVehicle);

module.exports = router;