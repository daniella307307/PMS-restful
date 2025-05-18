const { DataTypes, Op } = require("sequelize");
const sequelize = require("../config/db");
const ParkingLot = require('./parkingLot.model');
const ParkingSpot = require('./ParkingSpot.model');

const Booking = sequelize.define('Booking', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // Or SET NULL if bookings should be kept for deleted users
  },
  parkingLotId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'ParkingLots', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // If lot deleted, bookings for it are gone
  },
  parkingSpotId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Allow booking a lot generally, or a specific spot
    references: { model: 'ParkingSpots', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL' // If spot deleted, booking might still exist but without specific spot
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Optional, but good for tracking
    references: { model: 'Vehicles', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  startTime: { // Requested start time
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: { // Requested end time
    type: DataTypes.DATE,
    allowNull: false
  },
  expectedCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true // Calculated on booking creation
  },
  actualCheckInTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualCheckOutTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true // Calculated on check-out
  },
  status: { // 'pending_payment', 'confirmed', 'active', 'completed', 'cancelled', 'expired', 'no_show'
    type: DataTypes.ENUM('pending_payment', 'confirmed', 'active', 'completed', 'cancelled', 'expired', 'no_show'),
    defaultValue: 'pending_payment'
  },
  paymentId: { // For integration with payment gateways
    type: DataTypes.STRING,
    allowNull: true
  },
  // Add a grace period for check-in/check-out if needed
}, {
  timestamps: true,
  validate: {
     startBeforeEnd() {
         if (this.startTime && this.endTime && this.startTime >= this.endTime) {
             throw new Error('Booking start time must be before end time.');
         }
     },
     // More complex validation for overlapping bookings for a specific spot
     // This is better handled in the controller/service layer for new bookings
  },
  hooks: {
     afterCreate: async (booking, options) => {
         // If a specific spot is booked and status is confirmed, update spot status
         if (booking.parkingSpotId && (booking.status === 'confirmed' || booking.status === 'active')) {
             await ParkingSpot.update({ status: 'reserved' }, {
                 where: { id: booking.parkingSpotId },
                 transaction: options.transaction
             });
         }
         // Decrement available spots in the lot
         const lot = await ParkingLot.findByPk(booking.parkingLotId, { transaction: options.transaction });
         if (lot && !booking.parkingSpotId) { // If general booking, not specific spot
              // This is tricky if specific spots are also bookable. A simpler model might be:
              // All bookings target a specific spot. If no spotId provided, assign one.
              // For now, let's assume this just affects general availability if no spot is specified.
              // Or, the `availableSpots` on ParkingLot is mostly for "drive-in" availability
              // and reservations for specific spots reduce this count too.
         }
     },
     afterUpdate: async (booking, options) => {
         // If booking completed or cancelled, and it had a specific spot, make spot available
         if (booking.parkingSpotId && ['completed', 'cancelled', 'expired'].includes(booking.status)) {
             const previousStatus = booking.previous('status');
             if (['confirmed', 'active'].includes(previousStatus)) {
                 await ParkingSpot.update({ status: 'available' }, {
                     where: { id: booking.parkingSpotId },
                     transaction: options.transaction
                 });
             }
         }
         // Handle check-in: update spot to occupied
         if (booking.changed('status') && booking.status === 'active' && booking.parkingSpotId) {
             await ParkingSpot.update({ status: 'occupied' }, {
                 where: { id: booking.parkingSpotId },
                 transaction: options.transaction
             });
         }
     }
  }
});

module.exports = Booking;