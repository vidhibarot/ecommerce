import Router from "koa-router";

const controller = require("../controllers/dashboardController");
const router = new Router({ prefix: "/dashboard" });
import userAuth from "../middleware/auth";

//Get Dashboard  Data
/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get Dashboard Data
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: List of Dashboard Data
 */
router.get("/", userAuth,controller.getDashboardData);


export default router;
