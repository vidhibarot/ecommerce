import Router from "koa-router";

const controller = require("../controllers/countryController");
const router = new Router({ prefix: "/country" });

//Gell All Country Data
/**
 * @swagger
 * /country:
 *   get:
 *     summary: Get all country Data
 *     tags: [Country]
 *     security: []
 *     responses:
 *       200:
 *         description: List of country
 */
router.get("/", controller.getAllCountry);


export default router;
