import Router from "koa-router";

const controller = require("../controllers/productcontroller");
const router = new Router({ prefix: "/products" });
const upload = require('../middleware/upload');

//Gell All Products Data

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Get filtered products
 *     tags: [Products]
 *     security: []
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


/**
 * @swagger
 * /products/add:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 nullable: true
 *               price:
 *                 type: number
 *                 nullable: true
 *               description:
 *                 type: string
 *                 nullable: true
 *               categoryId:
 *                 type: string
 *                 nullable: true
 *               inStock:
 *                 type: integer
 *                 nullable: true
 *               discount:
 *                 type: string
 *                 nullable: true
 *               material:
 *                 type: string
 *                 nullable: true
 *               weight:
 *                 type: string
 *                 nullable: true
 *               size:
 *                 type: string
 *                 nullable: true
 *               attributes:
 *                 type: string
 *                 nullable: true
 *                 description: "JSON stringified object"
 *               features:
 *                 type: string
 *                 nullable: true
 *                 description: "JSON stringified array"
 *               careInstruction:
 *                 type: string
 *                 nullable: true
 *                 description: "JSON stringified array"
 *               story:
 *                 type: string
 *                 nullable: true
 *                 description: "JSON stringified story object with title, image (URL), and description"
 *               benefits:
 *                 type: string
 *                 nullable: true
 *                 description: "JSON stringified story object with title, image (URL), and description"
 *               use:
 *                 type: string
 *                 nullable: true
 *                 description: "JSON stringified story object with title, image (URL), and description"
 *               productImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 nullable: true
 *               image:
 *                 type: string
 *                 format: binary
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Product added successfully
 */
router.post('/add',upload.fields([ { name: 'image' },{ name: 'productImages' }
]), controller.addProductData);

//Get Product By Id
/**
 * @swagger
 * /products/get/{id}:
 *   get:
 *     summary: Get Product Data By Id
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the product
 *     responses:
 *       200:
 *         description: User updated
 */
router.get("/get/:id", controller.getProductById);

export default router;
