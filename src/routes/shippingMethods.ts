import Router from "koa-router";
import userAuth from "../middleware/auth";
const controller = require("../controllers/shippingMethodController");

const router = new Router({ prefix: "/shipping-method" });

/**
 * @swagger
 * tags:
 *   name: ShippingMethod
 *   description: Shipping Methods Management
 */

// Add Shipping Methods Data
/**
 * @swagger
 * /shipping-method/add:
 *   post:
 *     summary: Add a new shipping method
 *     tags: [ShippingMethod]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               minOrder:
 *                 type: integer
 *               amount:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shipping method created successfully
 */
router.post("/add", userAuth, controller.createShippingMethod);

// Update Shipping Method Data
/**
 * @swagger
 * /shipping-method/update/{id}:
 *   put:
 *     summary: Update a shipping method
 *     tags: [ShippingMethod]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shipping method ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               minOrder:
 *                 type: integer
 *               amount:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shipping method updated successfully
 *       404:
 *         description: Shipping method not found
 */
router.put("/update/:id", userAuth, controller.updateShippingMethod);

// Delete Shipping Method Data
/**
 * @swagger
 * /shipping-method/delete/{id}:
 *   delete:
 *     summary: Delete a shipping method
 *     tags: [ShippingMethod]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shipping method ID
 *     responses:
 *       200:
 *         description: Shipping method deleted successfully
 *       404:
 *         description: Shipping method not found
 */
router.delete("/delete/:id", userAuth, controller.deleteShippingMethod);

// Get Shipping Method by ID
/**
 * @swagger
 * /shipping-method/get/{id}:
 *   get:
 *     summary: Get a shipping method by ID
 *     tags: [ShippingMethod]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shipping method ID
 *     responses:
 *       200:
 *         description: Shipping method fetched successfully
 *       404:
 *         description: Shipping method not found
 */
router.get("/get/:id", userAuth, controller.getShippingMethodById);

// Get All Shipping Methods
/**
 * @swagger
 * /shipping-method/getAll:
 *   get:
 *     summary: Get all shipping methods
 *     tags: [ShippingMethod]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all shipping methods
 */
router.get("/getAll", userAuth, controller.getAllShippingMethods);

export default router;
