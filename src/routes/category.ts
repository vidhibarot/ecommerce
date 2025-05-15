import Router from "koa-router";
const controller = require("../controllers/categorycontroller");
const router = new Router({ prefix: "/category" });

//Add Category Data
/**
 * @swagger
 * /category/add:
 *   post:
 *     summary: Add categories Data
 *     tags: [Category]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.post("/add", controller.addCategoryData);

//Gell All Category Data
/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     security: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", controller.getAllCategoryData);

export default router;
