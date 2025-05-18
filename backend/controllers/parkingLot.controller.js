const ParkingLot = require('../models/parkingLot.model');
const ParkingSpot = require('../models/ParkingSpot.model'); // Will be created later
const User = require('../models/User.model');
const { createParkingLotSchema, updateParkingLotSchema } = require('../schema/parkingLot.schema');
const { Op } = require('sequelize');

// @desc    Create a new parking lot
// @route   POST /api/parking-lots
// @access  Private/Admin
exports.createParkingLot = async (req, res) => {
    try {
        const { error, value } = createParkingLotSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: "Validation failed", errors: error.details.map(d => d.message) });
        }

        // If ownerId is not provided, and logged-in user is admin, assign them as owner
        if (!value.ownerId && req.user.role === 'admin') {
            value.ownerId = req.user.id;
        }
        // Ensure ownerId (if provided) corresponds to an admin user or is null
        if (value.ownerId) {
             const owner = await User.findByPk(value.ownerId);
             if (!owner || owner.role !== 'admin') {
                 return res.status(400).json({ success: false, message: "Invalid ownerId or owner is not an admin." });
             }
        }

        const parkingLot = await ParkingLot.create(value);
        res.status(201).json({ success: true, data: parkingLot });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all parking lots
// @route   GET /api/parking-lots
// @access  Public
exports.getParkingLots = async (req, res) => {
    try {
        const { city, status, minAvailableSpots, maxRate } = req.query;
        const whereClause = {};

        if (city) whereClause.city = { [Op.iLike]: `%${city}%` };
        if (status) whereClause.status = status;
        if (minAvailableSpots) whereClause.availableSpots = { [Op.gte]: parseInt(minAvailableSpots) };
        if (maxRate) whereClause.hourlyRate = { [Op.lte]: parseFloat(maxRate) };

        const parkingLots = await ParkingLot.findAll({
            where: whereClause,
            include: [
                { model: User, as: 'owner', attributes: ['id', 'username', 'email'] },
                // Include count of spots later if ParkingSpot model is ready
                // { model: ParkingSpot, as: 'spots', attributes: [] } // For counting
            ]
        });
        res.status(200).json({ success: true, count: parkingLots.length, data: parkingLots });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single parking lot
// @route   GET /api/parking-lots/:id
// @access  Public
exports.getParkingLot = async (req, res) => {
    try {
        const parkingLot = await ParkingLot.findByPk(req.params.id, {
            include: [
                { model: User, as: 'owner', attributes: ['id', 'username', 'email'] },
                { model: ParkingSpot, as: 'spots', required: false } // 'required: false' for LEFT JOIN
            ]
        });
        if (!parkingLot) {
            return res.status(404).json({ success: false, message: 'Parking lot not found' });
        }
        res.status(200).json({ success: true, data: parkingLot });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update a parking lot
// @route   PUT /api/parking-lots/:id
// @access  Private/Admin
exports.updateParkingLot = async (req, res) => {
  try {
    const { error, value } = updateParkingLotSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: "Validation failed", 
        errors: error.details.map(d => d.message) 
      });
    }

    const parkingLot = await ParkingLot.findByPk(req.params.id);
    if (!parkingLot) {
      return res.status(404).json({ success: false, message: 'Parking lot not found' });
    }

    // Authorization: Only owner or admin can update
    if (req.user.role !== 'admin' && parkingLot.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this parking lot' });
    }

    // Validate ownerId if provided
    if (value.ownerId !== undefined) {
      if (value.ownerId !== null) {
        const owner = await User.findByPk(value.ownerId);
        if (!owner || owner.role !== 'admin') {
          return res.status(400).json({ success: false, message: "Invalid new ownerId or new owner is not an admin." });
        }
      }
    }

    // Perform update
    const affectedRows = await ParkingLot.update(value, {
      where: { id: req.params.id },
      individualHooks: true,
    });

    if (affectedRows[0] === 0) {
      return res.status(404).json({ success: false, message: 'Parking lot not found or no changes made' });
    }

    // Fetch updated parking lot after update
    const updatedLot = await ParkingLot.findByPk(req.params.id);

    res.status(200).json({ success: true, data: updatedLot });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a parking lot
// @route   DELETE /api/parking-lots/:id
// @access  Private/Admin
exports.deleteParkingLot = async (req, res) => {
    try {
        const parkingLot = await ParkingLot.findByPk(req.params.id);
        if (!parkingLot) {
            return res.status(404).json({ success: false, message: 'Parking lot not found' });
        }

         // Authorization: Only owner or general admin can delete
        if (req.user.role !== 'admin' && parkingLot.ownerId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this parking lot' });
        }

        await parkingLot.destroy(); // This will also delete associated ParkingSpots due to onDelete: 'CASCADE'
        res.status(200).json({ success: true, message: 'Parking lot deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};