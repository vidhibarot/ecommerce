import Router from "koa-router";
const controller = require("../controllers/cartItemsController");
const router = new Router({ prefix: "/cart" });
import userAuth from "../middleware/auth";

// Add CartItems Data
/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add cart Data
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User updated
 */
router.post("/add", userAuth,controller.addCartItems);

// // Update CartItems Data
// /**
//  * @swagger
//  * /cart/update:
//  *   put:
//  *     summary: Update cart Data
//  *     tags: [Cart]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - productId
//  *               - quantity
//  *             properties:
//  *               productId:
//  *                 type: integer
//  *               quantity:
//  *                 type: integer
//  *     responses:
//  *       200:
//  *         description: User updated
//  */
// router.post("/update", userAuth,controller.updateCartItems);



export default router;
