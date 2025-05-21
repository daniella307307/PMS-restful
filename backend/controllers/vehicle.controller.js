const Vehicle = require('../models/vehicle.model');
const { createVehicleSchema, updateVehicleSchema } = require('../schema/vehicle.schema');
const {Op} = require('sequelize');

// @desc    Add a vehicle for the logged-in user
// @route   POST /api/vehicles (or /api/me/vehicles)
// @access  Private
exports.addVehicle = async (req, res) => {
    try {
        const { error, value } = createVehicleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: "Validation failed", errors: error.details.map(d => d.message) });
        }

        const vehicleData = { ...value, userId: req.user.id };
        const vehicle = await Vehicle.create(vehicleData);
        res.status(201).json({ success: true, data: vehicle });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, message: `License plate '${req.body.licensePlate}' already registered.` });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all vehicles for the logged-in user
// @route   GET /api/vehicles
// @access  Private
exports.getMyVehicles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: vehicles } = await Vehicle.findAndCountAll({
      where: { userId: req.user.id },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: vehicles,
    });
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles,
        });
    } catch (err) {
        console.error('Error fetching vehicles:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};


// @desc    Get a specific vehicle by ID (owned by logged-in user)
// @route   GET /api/vehicles/:id
// @access  Private
exports.getVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found or not owned by user' });
        }
        res.status(200).json({ success: true, data: vehicle });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
        console.error(err);
    }
};

// @desc    Update a vehicle (owned by logged-in user)
// @route   PUT /api/vehicles/:id
// @access  Private
exports.updateVehicle = async (req, res) => {
    try {
        // Validate request body
        const { error, value } = updateVehicleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.details.map(d => d.message),
            });
        }

        // Find vehicle owned by current user
        const vehicle = await Vehicle.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found or not owned by user'
            });
        }

        // If licensePlate is being changed, check for duplicates
        if (value.licensePlate && value.licensePlate !== vehicle.licensePlate) {
            const existingPlate = await Vehicle.findOne({
                where: { licensePlate: value.licensePlate }
            });

            if (existingPlate && existingPlate.id !== vehicle.id) {
                return res.status(400).json({
                    success: false,
                    message: `License plate '${value.licensePlate}' is already registered.`
                });
            }
        }

        // Update the vehicle
        await vehicle.update(value);

        res.status(200).json({ success: true, data: vehicle });

    } catch (err) {
        // Handle unique constraint violation
        if (err.name === 'SequelizeUniqueConstraintError' && err.fields?.licensePlate) {
            return res.status(400).json({
                success: false,
                message: `License plate '${req.body.licensePlate}' is already registered.`
            });
        }

        // General server error
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete a vehicle (owned by logged-in user)
// @route   DELETE /api/vehicles/:id
// @access  Private
exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found or not owned by user' });
        }
        await vehicle.destroy();
        res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};