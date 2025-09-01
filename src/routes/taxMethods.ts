import Router from "koa-router";
import userAuth from "../middleware/auth";
const controller = require("../controllers/taxMethodController");

const router = new Router({ prefix: "/tax-method" });

/**
 * @swagger
 * tags:
 *   name: TaxMethod
 *   description: Tax Methods Management
 */

// Add Tax Methods Data
/**
 * @swagger
 * /tax-method/add:
 *   post:
 *     summary: Add a new tax method
 *     tags: [TaxMethod]
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
 *               rate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tax method created successfully
 */
router.post("/add", userAuth, controller.createTaxMethod);

// Update Tax Method Data
/**
 * @swagger
 * /tax-method/update/{id}:
 *   put:
 *     summary: Update a tax method
 *     tags: [TaxMethod]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tax method ID
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
 *               rate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tax method updated successfully
 *       404:
 *         description: Tax method not found
 */
router.put("/update/:id", userAuth, controller.updateTaxMethod);

// Delete Tax Method Data
/**
 * @swagger
 * /tax-method/delete/{id}:
 *   delete:
 *     summary: Delete a tax method
 *     tags: [TaxMethod]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tax method ID
 *     responses:
 *       200:
 *         description: Tax method deleted successfully
 *       404:
 *         description: Tax method not found
 */
router.delete("/delete/:id", userAuth, controller.deleteTaxMethod);

// Get Tax Method by ID
/**
 * @swagger
 * /tax-method/get/{id}:
 *   get:
 *     summary: Get a tax method by ID
 *     tags: [TaxMethod]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tax method ID
 *     responses:
 *       200:
 *         description: Tax method fetched successfully
 *       404:
 *         description: Tax method not found
 */
router.get("/get/:id", userAuth, controller.getTaxMethodById);

// Get All Tax Methods
/**
 * @swagger
 * /tax-method/getAll:
 *   get:
 *     summary: Get all tax methods
 *     tags: [TaxMethod]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tax methods
 */
router.get("/getAll", userAuth, controller.getAllTaxMethods);

export default router;
