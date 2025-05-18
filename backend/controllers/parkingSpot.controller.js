const ParkingSpot = require('../models/ParkingSpot.model');
const ParkingLot = require('../models/parkingLot.model');
const { createParkingSpotSchema, updateParkingSpotSchema } = require('../schema/parkingSpot.schema');

// @desc    Create a new parking spot for a lot
// @route   POST /api/parking-lots/:lotId/spots
// @access  Private/Admin
exports.createParkingSpot = async (req, res) => {
    try {
        const { lotId } = req.params;
        const { error, value } = createParkingSpotSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: "Validation failed", errors: error.details.map(d => d.message) });
        }

        const parkingLot = await ParkingLot.findByPk(lotId);
        if (!parkingLot) {
            return res.status(404).json({ success: false, message: 'Parking lot not found' });
        }
        // Authorization: Check if user owns the lot or is general admin
        if (req.user.role !== 'admin' && parkingLot.ownerId !== req.user.id) {
             return res.status(403).json({ success: false, message: 'Not authorized to add spots to this lot' });
        }


        const spotData = { ...value, parkingLotId: parseInt(lotId) };
        const parkingSpot = await ParkingSpot.create(spotData);

        res.status(201).json({ success: true, data: parkingSpot });
    } catch (err) {
         if (err.name === 'SequelizeUniqueConstraintError') {
             return res.status(400).json({ success: false, message: `Spot number '${req.body.spotNumber}' already exists in this lot.` });
         }
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all spots for a parking lot
// @route   GET /api/parking-lots/:lotId/spots
// @access  Public
exports.getParkingSpotsForLot = async (req, res) => {
    try {
        const { lotId } = req.params;
        const { status, spotType } = req.query;
        const whereClause = { parkingLotId: parseInt(lotId) };

        if (status) whereClause.status = status;
        if (spotType) whereClause.spotType = spotType;

        const parkingLot = await ParkingLot.findByPk(lotId);
         if (!parkingLot) {
             return res.status(404).json({ success: false, message: 'Parking lot not found' });
         }

        const spots = await ParkingSpot.findAll({ where: whereClause });
        res.status(200).json({ success: true, count: spots.length, data: spots });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get a single parking spot by its ID (globally, or within a lot)
// @route   GET /api/parking-lots/:lotId/spots/:spotId  OR GET /api/spots/:spotId
// @access  Public
exports.getParkingSpot = async (req, res) => {
    try {
        const { spotId } = req.params;

        const spot = await ParkingSpot.findByPk(spotId, {
            include: [
                {
                    model: ParkingLot,
                    as: 'lot' // <-- IMPORTANT: match the alias from the association
                }
            ]
        });

        if (!spot) {
            return res.status(404).json({ success: false, message: 'Parking spot not found' });
        }

        res.status(200).json({ success: true, data: spot });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// @desc    Update a parking spot
// @route   PUT /api/parking-lots/:lotId/spots/:spotId
// @access  Private/Admin
exports.updateParkingSpot = async (req, res) => {
    try {
        const { lotId, spotId } = req.params;

        // Validate the request body
        const { error, value } = updateParkingSpotSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.details.map(d => d.message),
            });
        }

        // Check if the parent parking lot exists
        const parkingLot = await ParkingLot.findByPk(lotId);
        if (!parkingLot) {
            return res.status(404).json({ success: false, message: 'Parent parking lot not found' });
        }

        // Authorization: only admin or lot owner can update
        if (req.user.role !== 'admin' && parkingLot.ownerId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update spots in this lot' });
        }

        // Check if the parking spot exists in this lot
        const spot = await ParkingSpot.findOne({
            where: { id: spotId, parkingLotId: lotId }
        });

        if (!spot) {
            return res.status(404).json({ success: false, message: 'Parking spot not found in this lot' });
        }

        // Update the spot
        await spot.update(value);

        res.status(200).json({ success: true, data: spot });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete a parking spot
// @route   DELETE /api/parking-lots/:lotId/spots/:spotId
// @access  Private/Admin
exports.deleteParkingSpot = async (req, res) => {
    try {
        const { lotId, spotId } = req.params;

        const parkingLot = await ParkingLot.findByPk(lotId);
        if (!parkingLot) {
            return res.status(404).json({ success: false, message: 'Parent parking lot not found' });
        }
         // Authorization: Check if user owns the lot or is general admin
        if (req.user.role !== 'admin' && parkingLot.ownerId !== req.user.id) {
             return res.status(403).json({ success: false, message: 'Not authorized to delete spots from this lot' });
        }

        const spot = await ParkingSpot.findOne({ where: { id: spotId, parkingLotId: lotId } });
        if (!spot) {
            return res.status(404).json({ success: false, message: 'Parking spot not found in this lot' });
        }

        await spot.destroy();
        res.status(200).json({ success: true, message: 'Parking spot deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};