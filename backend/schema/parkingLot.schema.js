const Joi = require('joi');

exports.createParkingLotSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(5).max(255).required(),
  city: Joi.string().min(2).max(100).optional(),
  zipCode: Joi.string().alphanum().min(3).max(10).optional(),
  latitude: Joi.number().min(-90).max(90).optional().allow(null),
  longitude: Joi.number().min(-180).max(180).optional().allow(null),
  totalSpots: Joi.number().integer().min(1).required(),
  availableSpots: Joi.number().integer().min(0).required(), // Will default if not provided
  openingTime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).optional().allow(null), // HH:MM or HH:MM:SS
  closingTime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).optional().allow(null),
  hourlyRate: Joi.number().precision(2).min(0).required(),
  status: Joi.string().valid('open', 'closed', 'full', 'maintenance').optional(),
  ownerId: Joi.number().integer().positive().optional().allow(null),
}).options({ abortEarly: false });

exports.updateParkingLotSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(5).max(255).required(),
  city: Joi.string().min(2).max(100).optional(),
  zipCode: Joi.string().alphanum().min(3).max(10).optional(),
  latitude: Joi.number().min(-90).max(90).optional().allow(null),
  longitude: Joi.number().min(-180).max(180).optional().allow(null),
  totalSpots: Joi.number().integer().min(1).required(),
  availableSpots: Joi.number().integer().min(0).required(),
  openingTime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).optional().allow(null),
  closingTime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).optional().allow(null),
  hourlyRate: Joi.number().precision(2).min(0).required(),
  status: Joi.string().valid('open', 'closed', 'full', 'maintenance').optional(),
  ownerId: Joi.number().integer().positive().required().allow(null),
}).min(1).options({ abortEarly: false }); // Requires at least one field to update