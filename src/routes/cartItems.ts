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

// Update CartItems Data
/**
 * @swagger
 * /cart/update/{cartId}:
 *   put:
 *     summary: Update cart Data
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cart to delete from cart data
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
router.put("/update/:cartId", userAuth,controller.updateCartItems);

//Delete CartItems Data
/**
 * @swagger
 * /cart/delete/{cartId}:
 *   delete:
 *     summary: Delete a cart item for the logged-in user
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cart to delete from cart data
 *     responses:
 *       200:
 *         description: Item deleted successfully
 */
router.delete("/delete/:cartId", userAuth, controller.deleteCartItems);

//Get CartItems Data
/**
 * @swagger
 * /cart/get:
 *   get:
 *     summary: get a cart item for the logged-in user
 *     tags: [Cart]
 *     description: get a cart item for the logged-in user
 *     responses:
 *       200:
 *         description: Item fetched successfully
 */
router.get("/get", userAuth, controller.getCartItems);

export default router;
