const Joi = require('joi');

exports.createVehicleSchema = Joi.object({
  licensePlate: Joi.string().alphanum().min(3).max(15).required()
      .pattern(/^[A-Z0-9]+$/i, 'alphanumeric'), // Example: case-insensitive alphanumeric
  make: Joi.string().max(50).optional().allow('', null),
  model: Joi.string().max(50).optional().allow('', null),
  color: Joi.string().max(30).optional().allow('', null),
  isDefault: Joi.boolean().optional().default(true)
}).options({ abortEarly: false });

exports.updateVehicleSchema = Joi.object({
  licensePlate: Joi.string().alphanum().min(3).max(15).optional()
     .pattern(/^[A-Z0-9]+$/i, 'alphanumeric'),
  make: Joi.string().max(50).optional().allow('', null),
  model: Joi.string().max(50).optional().allow('', null),
  color: Joi.string().max(30).optional().allow('', null),
  isDefault: Joi.boolean().optional()
}).min(1).options({ abortEarly: false });