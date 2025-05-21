const Booking = require('../models/booking.model');
const sendEmail = require('../utils/jwt.util');

exports.entry = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.actualCheckInTime = new Date();
        booking.status ="pending_payment"
        await booking.save();

        res.json({ message: 'Entry time recorded', booking });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.exit = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId).populate('user vehicle');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (!booking.actualStartTime) {
            return res.status(400).json({ message: 'Entry time not recorded' });
        }

        const exitTime = new Date();
        const durationMs = exitTime - booking.actualCheckInTime;

        const hours = Math.ceil(durationMs / (1000 * 60 * 60));
        const totalAmount = hours * booking.feePerHour;


        booking.actualCheckOutTime = exitTime;
        booking.totalAmount = totalAmount;
        await booking.save();

        // Send email to user
        await sendEmail({
            to: booking.user.email,
            subject: 'Parking Exit Details',
            text: `
                Vehicle: ${booking.vehicle.plateNumber}
                Entry Time: ${booking.actualStartTime}
                Exit Time: ${booking.actualEndTime}
                Duration: ${hours} hour(s)
                Total Amount: $${totalAmount}
            `
        });

        res.json({ message: 'Exit processed', booking, totalAmount });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};