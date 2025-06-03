import Router from "koa-router";

const controller = require("../controllers/orderController");
const router = new Router({ prefix: "/order" });
import userAuth from "../middleware/auth";
import { validateCreateOrder } from "../validator/orderValidator";

//Add Order Data 
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
 *               productId:
 *                 type: integer
 *               customerName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneno:
 *                 type: string
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
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created
 */
router.post("/add", validateCreateOrder,userAuth,controller.addOrder);

//Gell All Orders Data
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

//Payment refund
/**
 * @swagger
 * /order/{orderId}/refund:
 *   post:
 *     summary: Refund a payment and cancel the order
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to refund
 *     responses:
 *       200:
 *         description: Refund successful
 */
router.post("/order/:orderId/refund", controller.refundPayment);

//Create order
/**
 * @swagger
 * /order/create-order:
 *   post:
 *     summary: Create a Razorpay order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Razorpay order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 currency:
 *                   type: string
 *                 key:
 *                   type: string
 */
router.post("/create-order", userAuth, controller.createRazorpayOrder);

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
router.post('/verify-payment', controller.verifyPayment);

export default router;
