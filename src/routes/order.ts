import Router from "koa-router";

const controller = require("../controllers/orderController");
const router = new Router({ prefix: "/order" });
import userAuth from "../middleware/auth";
import { validateCreateOrder } from "../validator/orderValidator";

// Add Order Data

/**
 * @swagger
 * /order/add:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               customerName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneno:
 *                 type: string
 *               shippingMethodId:
 *                 type: integer
 *               address:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   address:
 *                     type: string
 *                   country:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipcode:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post("/add", validateCreateOrder, userAuth, controller.addOrder);

// Get All Orders Data
/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get all order Data
 *     tags: [Order]
 *     security: []
 *     responses:
 *       200:
 *         description: List of order
 */
router.get("/", controller.getAllOrder);

// Payment Refund
/**
 * @swagger
 * /order/{orderId}/refund:
 *   post:
 *     summary: Refund payment for a cancelled order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to refund
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refundAmount
 *             properties:
 *               refundAmount:
 *                 type: number
 *                 example: 600
 *                 description: Amount to refund (in main currency unit, e.g., INR)
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *       400:
 *         description: Bad request (e.g., already refunded or invalid refund amount)
 *       404:
 *         description: Order or transaction not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/:orderId/refund", controller.refundPayment);

// Payment verification
/**
 * @swagger
 * /order/verify-payment:
 *   post:
 *     summary: Verify Razorpay payment and store transaction
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - paymentId
 *               - transactionId
 *               - amount
 *             properties:
 *               orderId:
 *                 type: string
 *               paymentId:
 *                 type: string
 *               transactionId:
 *                 type: string
 *               amount:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Payment verification failed
 */
router.post("/verify-payment", controller.verifyPayment);

// Gell User Orders Data
/**
 * @swagger
 * /order/userOrders:
 *   get:
 *     summary: Get User order Data
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: List of user order
 */
router.get("/userOrders", userAuth, controller.getUsersOrder);

// Razorpay webhook
router.post("/razorpay-webhook", controller.razorpayWebhook);

// Add CartItems Data
/**
 * @swagger
 * /order/getdeliveryCharge:
 *   post:
 *     summary: Get Delivery Charge based on city and state
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Id
 *               - totalAmount
 *             properties:
 *               Id:
 *                 type: integer
 *               totalAmount:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Delivery charge
 */
router.post("/getdeliveryCharge", userAuth, controller.getDeliveryCharge);

//Cancel order data

/**
 * @swagger
 * /order/cancel/{id}:
 *   post:
 *     summary: Cancel an order with refund eligibility
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID to cancel
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       400:
 *         description: Cannot cancel order (either not refundable or invalid status)
 *       404:
 *         description: Order not found
 */
router.post("/cancel/:id", userAuth, controller.cancelOrder);

export default router;
