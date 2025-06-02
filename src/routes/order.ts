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

//Order payment
/**
 * @swagger
 * /order/payment:
 *   post:
 *     summary: Verify and store transaction after payment
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: string
 *               paymentId:
 *                 type: string
 *               transactionId:
 *                 type: string
 *               amount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction verified and saved
 */
router.post("/payment", userAuth, controller.orderPayment);

//Payment refund
/**
 * @swagger
 * /order/refund:
 *   post:
 *     summary: Refund a payment
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: string
 *                 description: Razorpay Payment ID to be refunded
 *     responses:
 *       200:
 *         description: Payment refunded successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/refund", userAuth, controller.refundPayment);


export default router;
