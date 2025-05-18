// Example: models/index.js or where you initialize Sequelize and models
const sequelize = require('../config/db'); // Your sequelize instance
const User = require('./User.model');
const ParkingLot = require('./parkingLot.model');
const ParkingSpot = require('./parkingSpot.model');
const Vehicle = require('./vehicle.model');
const Booking = require('./booking.model');

// User Associations
User.hasMany(ParkingLot, { foreignKey: 'ownerId', as: 'ownedLots' });
User.hasMany(Vehicle, { foreignKey: 'userId', as: 'vehicles' });
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });

// ParkingLot Associations
ParkingLot.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
ParkingLot.hasMany(ParkingSpot, { foreignKey: 'parkingLotId', as: 'spots', onDelete: 'CASCADE' });
ParkingLot.hasMany(Booking, { foreignKey: 'parkingLotId', as: 'lotBookings' }); // Renamed to avoid conflict

// ParkingSpot Associations
ParkingSpot.belongsTo(ParkingLot, { foreignKey: 'parkingLotId', as: 'lot' });
ParkingSpot.hasMany(Booking, { foreignKey: 'parkingSpotId', as: 'spotBookings' }); // Or hasOne for current active

// Vehicle Associations
Vehicle.belongsTo(User, { foreignKey: 'userId', as: 'userOwner' }); // Renamed to avoid conflict
Vehicle.hasMany(Booking, { foreignKey: 'vehicleId', as: 'vehicleBookings' }); // Renamed

// Booking Associations
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(ParkingLot, { foreignKey: 'parkingLotId', as: 'parkingLot' });
Booking.belongsTo(ParkingSpot, { foreignKey: 'parkingSpotId', as: 'parkingSpot' });
Booking.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

// Export all models and sequelize instance
module.exports = {
    sequelize,
    User,
    ParkingLot,
    ParkingSpot,
    Vehicle,
    Booking,
};

// Later, in your app.js or server.js:
// const { sequelize } = require('./models'); // if using models/index.js
// sequelize.sync({ alter: true }); // or { force: true } during dev if you need to drop tables