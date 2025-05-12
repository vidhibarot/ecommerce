import Router from "koa-router";

const controller = require("../controllers/productcontroller");
const router = new Router({ prefix: "/products" });

//Gell All Products Data

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Get filtered products
 *     tags: [Products]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filters:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     value:
 *                       type: string
 *     responses:
 *       200:
 *         description: Filtered product list
 */
router.post("/", controller.getAllProduct);



export default router;
