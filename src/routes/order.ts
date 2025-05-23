import Router from "koa-router";

const controller = require("../controllers/orderController");
const router = new Router({ prefix: "/order" });

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


export default router;
