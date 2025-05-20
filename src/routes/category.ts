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
 *               subcategory:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Subcat1", "Subcat2"]
 *     responses:
 *       200:
 *         description: User updated
 */
router.post("/add", controller.addCategoryData);

/**
 * @swagger
 * /category/update/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Category]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the category to update
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
 *               subcategory:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Subcat1", "Subcat2"]
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put("/update/:id", controller.updateCategoryData);

// Delete Category Data
/**
 * @swagger
 * /category/delete/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Category]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
router.delete("/delete/:id", controller.deleteCategoryData);

//Get Category By Id
/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Category]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the category to fetch
 *     responses:
 *       200:
 *         description: Category fetched successfully
 *       404:
 *         description: Category not found
 */
router.get("/:id", controller.getCategoryById);

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
