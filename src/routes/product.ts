import Router from "koa-router";

const controller = require("../controllers/usercontroller");
const upload = require("../middleware/upload");
const router = new Router({ prefix: "/users" });
import userAuth from "../middleware/auth";

//Gell All Users Data
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", controller.getAllUser);

//Get User Profile
/**
 * @swagger
 * /users/getprofile:
 *   post:
 *     summary: Get User Data
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User updated
 */
router.post("/getprofile", userAuth, controller.getUserProfile);

//Update User Profile
/**
 * @swagger
 * /users/updateprofile:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.put("/updateprofile", userAuth, controller.updateUserProfile);

export default router;
