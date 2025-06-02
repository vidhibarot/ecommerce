import Router from "koa-router";

const controller = require("../controllers/userPreferneceController");
const router = new Router({ prefix: "/userpreference" });
import userAuth from "../middleware/auth";


//Add UserPreference Data 
/**
 * @swagger
 * /userpreference/add:
 *   post:
 *     summary: Add a user preference address
 *     tags: [userpreference]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               address:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipcode:
 *                 type: string
 *             required:
 *               - type
 *               - address
 *               - country
 *               - city
 *               - state
 *               - zipcode
 *     responses:
 *       201:
 *         description: Address saved successfully
 */
router.post("/add",userAuth,controller.addUserPreferenceData);

//Update UserPreference Data 
/**
 * @swagger
 * /userpreference/update:
 *   put:
 *     summary: update a user preference address
 *     tags: [userpreference]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               address_id:
 *                 type: string
 *               address:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipcode:
 *                 type: string
 *             required:
 *               - type
 *               - address
 *               - country
 *               - city
 *               - state
 *               - zipcode
 *     responses:
 *       201:
 *         description: Address saved successfully
 */
router.put("/update",userAuth,controller.updateUserPreferenceData);

export default router;
