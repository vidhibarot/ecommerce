import Router from "koa-router";

const controller = require("../controllers/orderController");
const router = new Router({ prefix: "/order" });
import userAuth from "../middleware/auth";
import { validateCreateOrder } from "../validator/orderValidator";

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

export default router;
