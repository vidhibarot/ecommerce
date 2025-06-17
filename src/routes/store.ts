import Router from "koa-router";

const controller = require("../controllers/storeController");
const router = new Router({ prefix: "/store" });
import userAuth from "../middleware/auth";

// Add Store Data
/**
 * @swagger
 * /store/add:
 *   post:
 *     summary: Create a store
 *     tags: [Store]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               currency:
 *                 types: string
 *     responses:
 *       201:
 *         description: Store created successfully
 */
router.post("/add", userAuth, controller.addStoreData);

// Update Store Data
/**
 * @swagger
 * /store/update/{id}:
 *   put:
 *     summary: Update an existing store
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Store ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               currency:
 *                 type: string
 *     responses:
 *       200:
 *         description: Store updated successfully
 *       404:
 *         description: Store not found
 */
router.put("/update/:id", userAuth, controller.updateStore);

// Delete Store Data
/**
 * @swagger
 * /store/delete/{id}:
 *   delete:
 *     summary: Delete  store
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Store ID

 *     responses:
 *       200:
 *         description: Store deleted successfully
 *       404:
 *         description: Store not found
 */
router.delete("/delete/:id", userAuth, controller.deleteStore);

// Get Store
/**
 * @swagger
 * /store/get:
 *   get:
 *     summary: Get store
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Store fetched successfully
 *       404:
 *         description: Store not found
 */
router.get("/get", userAuth, controller.getStore);

export default router;
