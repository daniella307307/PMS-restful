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
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'], // Your annotated route files
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

