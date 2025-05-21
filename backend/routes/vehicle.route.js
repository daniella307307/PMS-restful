const express = require('express');
const router = express.Router();
const {
    addVehicle,
    getMyVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicles
} = require('../controllers/vehicle.controller');
const { protect } = require('../middleware/authMiddleware'); // No admin role needed for own vehicles

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management APIs
 */

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Add a vehicle for the logged-in user
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVehicle'
 *     responses:
 *       201:
 *         description: Vehicle added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponse'
 *       400:
 *         description: Validation error or duplicate license plate
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles of the logged-in user (paginated)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: List of user's vehicles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedVehicleResponse'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/vehicles/getall:
 *   get:
 *     summary: Get all vehicles of the logged-in user (no pagination)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all vehicles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleListResponse'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get a specific vehicle by ID
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponse'
 *       404:
 *         description: Vehicle not found or not owned by user
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVehicle'
 *     responses:
 *       200:
 *         description: Vehicle updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponse'
 *       400:
 *         description: Validation or duplicate license plate
 *       404:
 *         description: Vehicle not found or not owned by user
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted
 *       404:
 *         description: Vehicle not found or not owned by user
 *       500:
 *         description: Server error
 */

router.use(protect); // All vehicle routes are protected
router.post('/', protect,addVehicle)
router.get('/',protect,getMyVehicles)
router.get('/getall',protect,getVehicles)

router.route('/:id')
    .get(getVehicle)
    .put(updateVehicle)
    .delete(deleteVehicle);

module.exports = router;