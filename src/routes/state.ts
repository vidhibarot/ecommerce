import Router from "koa-router";

const controller = require("../controllers/stateController");
const router = new Router({ prefix: "/state" });

//Gell All State Data
/**
 * @swagger
 * /state:
 *   get:
 *     summary: Get all state Data
 *     tags: [State]
 *     security: []
 *     responses:
 *       200:
 *         description: List of state
 */
router.get("/", controller.getAllState);

// Get states by countryId
/**
 * @swagger
 * /state/country/{countryId}:
 *   get:
 *     summary: Get states by countryId
 *     tags: [State]
 *     parameters:
 *       - in: path
 *         name: countryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Country ID
 *     responses:
 *       200:
 *         description: List of states for given country
 */
router.get("/country/:countryId", controller.getStatesByCountryId);


export default router;
