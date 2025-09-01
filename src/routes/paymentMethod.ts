import Router from "koa-router";
import userAuth from "../middleware/auth";
const controller = require("../controllers/paymentMethodController");

const router = new Router({ prefix: "/payment-method" });

/**
 * @swagger
 * tags:
 *   name: PaymentMethod
 *   description: Payment Methods Management
 */

//Add Payment Methods
/**
 * @swagger
 * /payment-method/add:
 *   post:
 *     summary: Add a new payment method
 *     tags: [PaymentMethod]
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
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               config:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment method created successfully
 */
router.post("/add", userAuth, controller.addPaymentMethod);

//Update Payment Methods
/**
 * @swagger
 * /payment-method/update/{id}:
 *   put:
 *     summary: Update a payment method
 *     tags: [PaymentMethod]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment method ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               config:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment method updated successfully
 *       404:
 *         description: Payment method not found
 */
router.put("/update/:id", userAuth, controller.updatePaymentMethod);

//Delete Payment Methods By id
/**
 * @swagger
 * /payment-method/delete/{id}:
 *   delete:
 *     summary: Delete a payment method
 *     tags: [PaymentMethod]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment method ID
 *     responses:
 *       200:
 *         description: Payment method deleted successfully
 *       404:
 *         description: Payment method not found
 */
router.delete("/delete/:id", userAuth, controller.deletePaymentMethod);

//Get Payment Methods By id
/**
 * @swagger
 * /payment-method/get/{id}:
 *   get:
 *     summary: Get a payment method by ID
 *     tags: [PaymentMethod]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment method ID
 *     responses:
 *       200:
 *         description: Payment method fetched successfully
 *       404:
 *         description: Payment method not found
 */
router.get("/get/:id", userAuth, controller.getPaymentMethodById);

//Get All Payment Methods
/**
 * @swagger
 * /payment-method/getAll:
 *   get:
 *     summary: Get all payment methods
 *     tags: [PaymentMethod]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all payment methods
 */
router.get("/getAll", userAuth, controller.getAllPaymentMethods);

export default router;
