const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const ParkingLot = require('../models/parkingLot.model'); // For hook

const ParkingSpot = sequelize.define('ParkingSpot', {
  spotNumber: { // e.g., "A1", "101", "EV05"
    type: DataTypes.STRING,
    allowNull: false
  },
  parkingLotId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ParkingLots', // Name of the ParkingLots table
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // If a lot is deleted, its spots are deleted
  },
  status: {
    type: DataTypes.ENUM('available', 'occupied', 'reserved', 'maintenance'),
    defaultValue: 'available'
  },
  spotType: { // e.g., compact, regular, large, ev_charging, handicap
    type: DataTypes.ENUM('compact', 'regular', 'large', 'ev_charging', 'handicap'),
    defaultValue: 'regular'
  },
  // You might add currentBookingId here if a spot can only have one active booking
  // currentBookingId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  //   references: { model: 'Bookings', key: 'id' },
  //   onDelete: 'SET NULL'
  // }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['parkingLotId', 'spotNumber'] // Each spot number must be unique within a parking lot
    }
  ],
  hooks: {
     // After creating a spot, increment availableSpots in ParkingLot
     afterCreate: async (spot, options) => {
         const lot = await ParkingLot.findByPk(spot.parkingLotId);
         if (lot && spot.status === 'available') {
             await lot.increment('availableSpots', { by: 1, transaction: options.transaction });
         }
     },
     // Before destroying a spot, decrement availableSpots if it was available
     beforeDestroy: async (spot, options) => {
         const lot = await ParkingLot.findByPk(spot.parkingLotId);
         if (lot && spot.status === 'available') {
             await lot.decrement('availableSpots', { by: 1, transaction: options.transaction });
         }
     },
     // After updating a spot's status
     afterUpdate: async (spot, options) => {
         if (spot.changed('status')) {
             const lot = await ParkingLot.findByPk(spot.parkingLotId);
             if (lot) {
                 const previousStatus = spot.previous('status');
                 const currentStatus = spot.status;

                 if (previousStatus !== 'available' && currentStatus === 'available') {
                     await lot.increment('availableSpots', { by: 1, transaction: options.transaction });
                 } else if (previousStatus === 'available' && currentStatus !== 'available') {
                     await lot.decrement('availableSpots', { by: 1, transaction: options.transaction });
                 }
                 // Check if lot is full
                 if (lot.availableSpots === 0 && lot.status !== 'full' && lot.status !== 'closed' && lot.status !== 'maintenance') {
                     await lot.update({ status: 'full' }, { transaction: options.transaction });
                 } else if (lot.availableSpots > 0 && lot.status === 'full') {
                     await lot.update({ status: 'open' }, { transaction: options.transaction });
                 }
             }
         }
     }
  }
});

module.exports = ParkingSpot;