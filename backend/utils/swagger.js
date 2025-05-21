// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Parking Management API',
      version: '1.0.0',
      description: 'API documentation for vehicle and parking management system',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Existing vehicle schemas
        CreateVehicle: {
          type: 'object',
          required: ['make', 'model', 'licensePlate'],
          properties: {
            make: { type: 'string', example: 'Toyota' },
            model: { type: 'string', example: 'Corolla' },
            licensePlate: { type: 'string', example: 'ABC123' },
          },
        },
        UpdateVehicle: {
          type: 'object',
          properties: {
            make: { type: 'string', example: 'Honda' },
            model: { type: 'string', example: 'Civic' },
            licensePlate: { type: 'string', example: 'XYZ987' },
          },
        },
        Vehicle: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            make: { type: 'string' },
            model: { type: 'string' },
            licensePlate: { type: 'string' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        VehicleResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: '#/components/schemas/Vehicle' },
          },
        },
        VehicleListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            count: { type: 'integer' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Vehicle' },
            },
          },
        },
        PaginatedVehicleResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            count: { type: 'integer' },
            total: { type: 'integer' },
            currentPage: { type: 'integer' },
            totalPages: { type: 'integer' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Vehicle' },
            },
          },
        },
        // Booking schemas
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            parkingLotId: { type: 'integer' },
            parkingSpotId: { type: 'integer' },
            vehicleId: { type: 'integer' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            status: { type: 'string' },
            actualCheckInTime: { type: 'string', format: 'date-time' },
            actualCheckOutTime: { type: 'string', format: 'date-time' },
            totalAmount: { type: 'number' },
            feePerHour: { type: 'number' },
          },
        },
        ParkingLot: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Downtown Parking Lot' },
            city: { type: 'string', example: 'New York' },
            address: { type: 'string', example: '123 Main St' },
            status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
            hourlyRate: { type: 'number', format: 'float', example: 2.5 },
            availableSpots: { type: 'integer', example: 25 },
            ownerId: { type: 'integer', example: 2 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ParkingLotCreate: {
          type: 'object',
          required: ['name', 'city', 'address', 'status', 'hourlyRate', 'availableSpots'],
          properties: {
            name: { type: 'string', example: 'Downtown Parking Lot' },
            city: { type: 'string', example: 'New York' },
            address: { type: 'string', example: '123 Main St' },
            status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
            hourlyRate: { type: 'number', format: 'float', example: 2.5 },
            availableSpots: { type: 'integer', example: 25 },
            ownerId: { type: 'integer', description: 'Optional admin user ID as owner' },
          },
        },
        ParkingLotUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Downtown Parking Lot' },
            city: { type: 'string', example: 'New York' },
            address: { type: 'string', example: '123 Main St' },
            status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
            hourlyRate: { type: 'number', format: 'float', example: 3.0 },
            availableSpots: { type: 'integer', example: 30 },
            ownerId: { type: 'integer', description: 'Optional new owner admin user ID' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Bookings', description: 'Booking management' },
      { name: 'EntryExit', description: 'Parking entry and exit management' },
      { name: 'ParkingLots', description: 'Parking lot management' },
    ],
    paths: {
      '/parking-lots': {
        get: {
          summary: 'Get all parking lots',
          tags: ['ParkingLots'],
          parameters: [
            {
              in: 'query',
              name: 'city',
              schema: { type: 'string' },
              description: 'Filter by city (case-insensitive partial match)',
            },
            {
              in: 'query',
              name: 'status',
              schema: { type: 'string', enum: ['active', 'inactive'] },
              description: 'Filter by status',
            },
            {
              in: 'query',
              name: 'minAvailableSpots',
              schema: { type: 'integer' },
              description: 'Minimum available spots',
            },
            {
              in: 'query',
              name: 'maxRate',
              schema: { type: 'number', format: 'float' },
              description: 'Maximum hourly rate',
            },
          ],
          responses: {
            '200': {
              description: 'List of parking lots',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      count: { type: 'integer', example: 3 },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/ParkingLot' },
                      },
                    },
                  },
                },
              },
            },
            '500': { description: 'Server error' },
          },
        },
        post: {
          summary: 'Create a new parking lot',
          tags: ['ParkingLots'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ParkingLotCreate' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Parking lot created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/ParkingLot' },
                    },
                  },
                },
              },
            },
            '400': { description: 'Validation failed or invalid ownerId' },
            '500': { description: 'Server error' },
          },
        },
      },
      '/parking-lots/{id}': {
        get: {
          summary: 'Get a single parking lot by ID',
          tags: ['ParkingLots'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'Parking lot ID',
            },
          ],
          responses: {
            '200': {
              description: 'Parking lot found',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/ParkingLot' },
                    },
                  },
                },
              },
            },
            '404': { description: 'Parking lot not found' },
            '500': { description: 'Server error' },
          },
        },
        put: {
          summary: 'Update a parking lot by ID',
          tags: ['ParkingLots'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'Parking lot ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ParkingLotUpdate' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Parking lot updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/ParkingLot' },
                    },
                  },
                },
              },
            },
            '400': { description: 'Validation failed or invalid ownerId' },
            '403': { description: 'Not authorized to update' },
            '404': { description: 'Parking lot not found' },
            '500': { description: 'Server error' },
          },
        },
        delete: {
          summary: 'Delete a parking lot by ID',
          tags: ['ParkingLots'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'Parking lot ID',
            },
          ],
          responses: {
            '200': {
              description: 'Parking lot deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Parking lot deleted successfully' },
                    },
                  },
                },
              },
            },
            '403': { description: 'Not authorized to delete' },
            '404': { description: 'Parking lot not found' },
            '500': { description: 'Server error' },
          },
        },
      },
      '/bookings': {
        post: {
          summary: 'Create a new booking',
          tags: ['Bookings'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['parkingLotId', 'startTime', 'endTime'],
                  properties: {
                    parkingLotId: { type: 'integer' },
                    parkingSpotId: { type: 'integer' },
                    vehicleId: { type: 'integer' },
                    startTime: { type: 'string', format: 'date-time' },
                    endTime: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Booking created successfully' },
            '400': { description: 'Validation error or booking conflict' },
            '500': { description: 'Server error' },
          },
        },
        get: {
          summary: 'Get all bookings (Admin only)',
          tags: ['Bookings'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'userId',
              schema: { type: 'integer' },
            },
            {
              in: 'query',
              name: 'parkingLotId',
              schema: { type: 'integer' },
            },
            {
              in: 'query',
              name: 'status',
              schema: {
                type: 'string',
                enum: ['confirmed', 'cancelled', 'completed', 'active', 'expired'],
              },
            },
          ],
          responses: {
            '200': { description: 'List of all bookings' },
            '403': { description: 'Forbidden' },
            '500': { description: 'Server error' },
          },
        },
      },
      '/bookings/my-bookings': {
        get: {
          summary: 'Get bookings for the logged-in user',
          tags: ['Bookings'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'status',
              schema: {
                type: 'string',
                enum: ['confirmed', 'cancelled', 'completed', 'active', 'expired'],
              },
            },
            {
              in: 'query',
              name: 'upcoming',
              schema: { type: 'string', enum: ['true', 'false'] },
            },
          ],
          responses: {
            '200': { description: 'List of user bookings' },
            '500': { description: 'Server error' },
          },
        },
      },
      '/bookings/{id}': {
        get: {
          summary: 'Get details of a specific booking',
          tags: ['Bookings'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'Booking ID',
            },
          ],
          responses: {
            '200': { description: 'Booking details retrieved' },
            '404': { description: 'Booking not found' },
            '403': { description: 'Unauthorized access' },
            '500': { description: 'Server error' },
          },
        },
      },
      '/bookings/{id}/cancel': {
        put: {
          summary: 'Cancel a confirmed booking',
          tags: ['Bookings'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'Booking ID',
            },
          ],
          responses: {
            '200': { description: 'Booking cancelled successfully' },
            '400': { description: 'Cannot cancel booking' },
            '403': { description: 'Unauthorized' },
            '404': { description: 'Booking not found' },
            '500': { description: 'Server error' },
          },
        },
      },
      '/bookings/{id}/status': {
        put: {
          summary: 'Update booking status (Admin only)',
          tags: ['Bookings'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'Booking ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['confirmed', 'active', 'completed', 'cancelled', 'expired'],
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Booking status updated' },
            '400': { description: 'Validation error' },
            '404': { description: 'Booking not found' },
            '500': { description: 'Server error' },
          },
        },
      },
      '/entry-exit/entry': {
        post: {
          summary: 'Record entry time for a booking',
          tags: ['EntryExit'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['bookingId'],
                  properties: {
                    bookingId: { type: 'string', description: 'ID of the booking' },
                    actualCheckInTime: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Actual check-in time, defaults to now if omitted',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Entry time recorded' },
            '404': { description: 'Booking not found' },
            '500': { description: 'Server error' },
          },
        },
      },
      '/entry-exit/exit': {
        post: {
          summary: 'Record exit time for a booking and calculate fees',
          tags: ['EntryExit'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['bookingId'],
                  properties: {
                    bookingId: { type: 'string', description: 'ID of the booking' },
                    actualCheckOutTime: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Actual check-out time, defaults to now if omitted',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Exit time recorded and fees calculated',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      totalAmount: { type: 'number', example: 10.5 },
                      durationHours: { type: 'number', example: 2 },
                    },
                  },
                },
              },
            },
            '404': { description: 'Booking not found' },
            '500': { description: 'Server error' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`✅ Swagger Docs available at: http://localhost:5000/api-docs`);
};

module.exports = setupSwaggerDocs;