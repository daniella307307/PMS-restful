const Joi = require('joi');

exports.createParkingSpotSchema = Joi.object({
  spotNumber: Joi.string().min(1).max(20).required(),
  // parkingLotId will be from the route parameter
  status: Joi.string().valid('available', 'occupied', 'reserved', 'maintenance').optional(),
  spotType: Joi.string().valid('compact', 'regular', 'large', 'ev_charging', 'handicap').optional(),
}).options({ abortEarly: false });

exports.updateParkingSpotSchema = Joi.object({
  spotNumber: Joi.string().min(1).max(20).optional(),
  status: Joi.string().valid('available', 'occupied', 'reserved', 'maintenance').optional(),
  spotType: Joi.string().valid('compact', 'regular', 'large', 'ev_charging', 'handicap').optional(),
}).min(1).options({ abortEarly: false }); // Requires at least one field