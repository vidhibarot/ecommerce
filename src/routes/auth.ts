import Router from "koa-router";
import { validateLogin, validateRegister, validateUpdateUser } from "../validator/authValidator";
const {
  register,
  login,
  forgotPassword,
  updateUserById,
  getUserById,
  resendOTP,
  verifyOtp,
  resetPassword
} = require("../controllers/authcontroller");
const router = new Router({ prefix: "/auth" });

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

// User Register
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

// User Login
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

// Forgot Password
/**
 * @swagger
 * /auth/forgotpassword:
 *   post:
 *     summary: Generate OTP for forgot password
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
 *                 example: example@example.com
 *     responses:
 *       200:
 *         description: OTP sent to email
 */
router.post("/forgotpassword", forgotPassword);

// Resend OTP
/**
 * @swagger
 * /auth/resendotp:
 *   post:
 *     summary: Resend OTP to email
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
 *                 example: example@example.com
 *     responses:
 *       200:
 *         description: OTP resent to email
 */
router.post("/resendotp", resendOTP);

// Verify OTP
/**
 * @swagger
 * /auth/verifyotp:
 *   post:
 *     summary: Verify OTP for forgot password
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
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post("/verifyotp", verifyOtp);

//Reset Password
/**
 * @swagger
 * /auth/resetpassword:
 *   post:
 *     summary: Reset password using email
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
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "NewSecurePassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully"
 */
router.post("/resetpassword", resetPassword);

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
