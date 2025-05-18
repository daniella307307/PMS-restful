const Joi = require('joi');

exports.createBookingSchema = Joi.object({
  parkingLotId: Joi.number().integer().required(),
  parkingSpotId: Joi.number().integer().optional(), // Optional if system auto-assigns
  vehicleId: Joi.number().integer().required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().greater(Joi.ref('startTime')).required()
});

exports.updateBookingSchema = Joi.object({
  parkingLotId: Joi.forbidden(), // Prevent updating lot
  parkingSpotId: Joi.number().integer().optional(), // Allow changing spot
  vehicleId: Joi.number().integer().optional(),
  startTime: Joi.date().iso().optional(),
  endTime: Joi.date().iso().greater(Joi.ref('startTime')).optional(),
  status: Joi.string().valid('confirmed', 'cancelled', 'completed', 'expired').optional()
}).min(1); // Require at least one field to be provided