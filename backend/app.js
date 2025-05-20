// In your main app.js or server.js
const express = require('express');
const dotenv = require('dotenv');
const cors= require('cors');


// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// --- Mount Routers ---
const userRoutes = require('./routes/user.route');
const parkingLotRoutes = require('./routes/parkingLot.route');
const vehicleRoutes = require('./routes/vehicle.route');
const bookingRoutes = require('./routes/bookingRoutes');
const parkingSpotRoutes = require('./routes/parkingSpot.route');
//Enable cors
app.use(cors({origin: '*'}));

// Note: ParkingSpot routes are nested under ParkingLot routes, so no direct mount here.

app.use('/api/users', userRoutes);
app.use('/api/parking-lots', parkingLotRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/parking-lots/:lotId/spots', parkingSpotRoutes);

// Global Error Handler (example)
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        // ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    });
});

const PORT = process.env.PORT || 5000;

// Sync database and start server
const { sequelize } = require('./models/index'); // If you use models/index.js
// Or if you define associations directly after model imports:
// const sequelize = require('./config/db');
// require('./models/associations'); // a file where you put all associations if not in models/index.js

sequelize.sync({ alter: true }) // Use { force: true } cautiously in dev to drop and recreate tables
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    })
    .catch(err => console.error('Unable to connect to the database or sync:', err));