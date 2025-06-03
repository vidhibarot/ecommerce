import Router from "koa-router";
import { validateLogin, validateRegister, validateUpdateUser } from "../validator/authValidator";
const {
  register,
  login,
  forgotPassword,
  updateUserById,
  getUserById,
} = require("../controllers/authcontroller");
const router = new Router({ prefix: "/auth" });

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

//User Register
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *               - phoneno
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               phoneno:
 *                 type: string
 *               adminPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered
 */
router.post("/register",validateRegister, register);

//User Login
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
router.post("/login", validateLogin, login);

//Forgot Password
/**
 * @swagger
 * /auth/forgotpassword:
 *   post:
 *     summary: forgot password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
router.post("/forgotpassword", forgotPassword);

//Update User
/**
 * @swagger
 * /auth/update/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the user
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
router.put("/update/:id",validateUpdateUser, updateUserById);

//Get User By Id
/**
 * @swagger
 * /auth/get/{id}:
 *   get:
 *     summary: Get User Data
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the user
 *     responses:
 *       200:
 *         description: User updated
 */
router.get("/get/:id", getUserById);

export default router;
