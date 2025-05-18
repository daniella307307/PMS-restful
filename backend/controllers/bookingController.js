const { Op, Sequelize } = require('sequelize');
const sequelize = require('../config/db');
const Booking = require('../models/booking.model');
const ParkingLot = require('../models/parkingLot.model');
const ParkingSpot = require('../models/ParkingSpot.model');
const Vehicle = require('../models/vehicle.model');
const User = require('../models/User.model');
const { createBookingSchema, updateBookingStatusSchema } = require('../schema/booking.schema');

// Helper functions remain unchanged...

exports.createBooking = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { error, value } = createBookingSchema.validate(req.body);
        if (error) {
            await t.rollback();
            return res.status(400).json({ success: false, message: "Validation failed", errors: error.details.map(d => d.message) });
        }

        const { parkingLotId, parkingSpotId, vehicleId, startTime, endTime } = value;
        const userId = req.user.id;

        const parkingLot = await ParkingLot.findByPk(parkingLotId, { transaction: t });
        if (!parkingLot || ['closed', 'maintenance'].includes(parkingLot.status)) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Parking lot not found or is currently unavailable.' });
        }

        if (parkingLot.status === 'full' && !parkingSpotId) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Parking lot is currently full.' });
        }

        if (vehicleId) {
            const vehicle = await Vehicle.findOne({ where: { id: vehicleId, userId }, transaction: t });
            if (!vehicle) {
                await t.rollback();
                return res.status(400).json({ success: false, message: 'Vehicle not found or does not belong to user.' });
            }
        }

        let finalParkingSpotId = parkingSpotId;

        if (parkingSpotId) {
            const spot = await ParkingSpot.findOne({ where: { id: parkingSpotId, parkingLotId }, transaction: t });
            if (!spot) {
                await t.rollback();
                return res.status(404).json({ success: false, message: 'Requested parking spot not found in this lot.' });
            }
            if (['maintenance', 'occupied'].includes(spot.status)) {
                await t.rollback();
                return res.status(400).json({ success: false, message: 'Requested parking spot is currently unavailable (maintenance/occupied).' });
            }

            const available = await isSpotAvailable(parkingSpotId, startTime, endTime, null, t);
            if (!available) {
                await t.rollback();
                return res.status(400).json({ success: false, message: 'Requested parking spot is not available for the selected time.' });
            }
        } else {
            const availableSpot = await ParkingSpot.findOne({
                where: {
                    parkingLotId,
                    status: 'available',
                    id: {
                        [Op.notIn]: Sequelize.literal(
                            `(SELECT "parkingSpotId" FROM "Bookings" WHERE "parkingSpotId" IS NOT NULL AND "parkingLotId" = ${parkingLotId} AND "status" NOT IN ('cancelled', 'completed', 'expired') AND ("startTime" < '${endTime}' AND "endTime" > '${startTime}'))`
                        )
                    }
                },
                transaction: t
            });

            if (!availableSpot) {
                await t.rollback();
                return res.status(400).json({ success: false, message: 'No available spots in this lot for the selected time.' });
            }
            finalParkingSpotId = availableSpot.id;
        }

        if (!finalParkingSpotId) {
            await t.rollback();
            return res.status(500).json({ success: false, message: 'Could not assign a parking spot.' });
        }

        const expectedCost = calculateCost(startTime, endTime, parkingLot.hourlyRate);

        const booking = await Booking.create({
            userId,
            parkingLotId,
            parkingSpotId: finalParkingSpotId,
            vehicleId,
            startTime,
            endTime,
            expectedCost,
            status: 'confirmed'
        }, { transaction: t });

        await t.commit();
        return res.status(201).json({ success: true, data: booking });

    } catch (err) {
        await t.rollback();
        console.error("Create Booking Error:", err);
        return res.status(500).json({ success: false, message: err.message || "Failed to create booking." });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const { status, upcoming } = req.query;
        const whereClause = { userId: req.user.id };

        if (status) whereClause.status = status;
        if (upcoming === 'true') whereClause.startTime = { [Op.gte]: new Date() };
        else if (upcoming === 'false') whereClause.endTime = { [Op.lt]: new Date() };

        const bookings = await Booking.findAll({
            where: whereClause,
            include: [
                { model: ParkingLot, as: 'parkingLot', attributes: ['id', 'name', 'address'] },
                { model: ParkingSpot, as: 'parkingSpot', attributes: ['id', 'spotNumber'] },
                { model: Vehicle, as: 'vehicle', attributes: ['id', 'licensePlate'] }
            ],
            order: [['startTime', 'DESC']]
        });

        return res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                { model: ParkingLot, as: 'parkingLot', attributes: ['id', 'name', 'address', 'hourlyRate'] },
                { model: ParkingSpot, as: 'parkingSpot', attributes: ['id', 'spotNumber', 'spotType'] },
                { model: Vehicle, as: 'vehicle', attributes: ['id', 'licensePlate', 'make', 'model'] },
                { model: User, as: 'user', attributes: ['id', 'username', 'email'] }
            ]
        });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
        }

        return res.status(200).json({ success: true, data: booking });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.cancelBooking = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const booking = await Booking.findByPk(req.params.id, { transaction: t });
        if (!booking) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        if (booking.userId !== req.user.id) {
            await t.rollback();
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
        }
        if (booking.status !== 'confirmed') {
            await t.rollback();
            return res.status(400).json({ success: false, message: `Cannot cancel booking with status: ${booking.status}` });
        }
        if (new Date(booking.startTime) < new Date(Date.now() + 60 * 60 * 1000)) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Booking cannot be cancelled less than 1 hour before start time.' });
        }

        booking.status = 'cancelled';
        await booking.save({ transaction: t });

        await t.commit();
        return res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateBookingStatusByAdmin = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { error, value } = updateBookingStatusSchema.validate(req.body);
        if (error) {
            await t.rollback();
            return res.status(400).json({ success: false, message: "Validation failed", errors: error.details.map(d => d.message) });
        }

        const booking = await Booking.findByPk(req.params.id, { include: [{ model: ParkingLot, as: 'parkingLot' }], transaction: t });
        if (!booking) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = value.status;

        if (value.status === 'active' && !booking.actualCheckInTime) {
            booking.actualCheckInTime = new Date();
        } else if (value.status === 'completed' && !booking.actualCheckOutTime) {
            booking.actualCheckOutTime = new Date();
            if (!booking.actualCost && booking.actualCheckInTime && booking.parkingLot) {
                booking.actualCost = calculateCost(booking.actualCheckInTime, booking.actualCheckOutTime, booking.parkingLot.hourlyRate);
            }
        }

        await booking.save({ transaction: t });

        await t.commit();
        return res.status(200).json({ success: true, message: `Booking status updated to ${booking.status}`, data: booking });
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const { userId, parkingLotId, status } = req.query;
        const whereClause = {};

        if (userId) whereClause.userId = userId;
        if (parkingLotId) whereClause.parkingLotId = parkingLotId;
        if (status) whereClause.status = status;

        const bookings = await Booking.findAll({
            where: whereClause,
            include: [
                { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
                { model: ParkingLot, as: 'parkingLot', attributes: ['id', 'name'] },
                { model: ParkingSpot, as: 'parkingSpot', attributes: ['id', 'spotNumber'] }
            ],
            order: [['startTime', 'DESC']]
        });

        return res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

async function isSpotAvailable(parkingSpotId, startTime, endTime, excludeBookingId = null, transaction) {
    const whereClause = {
        parkingSpotId,
        status: { [Op.notIn]: ['cancelled', 'completed', 'expired'] },
        [Op.and]: [
            { startTime: { [Op.lt]: endTime } },
            { endTime: { [Op.gt]: startTime } }
        ]
    };
    if (excludeBookingId) {
        whereClause.id = { [Op.ne]: excludeBookingId };
    }
    const existingBooking = await Booking.findOne({ where: whereClause, transaction });
    return !existingBooking;
}
function calculateCost(startTime, endTime, hourlyRate) {
    const durationMs = new Date(endTime) - new Date(startTime);
    const durationHours = durationMs / (1000 * 60 * 60);
    return parseFloat((durationHours * hourlyRate).toFixed(2));
}