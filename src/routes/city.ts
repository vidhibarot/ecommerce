import Router from "koa-router";

const controller = require("../controllers/cityController");
const router = new Router({ prefix: "/city" });

//Gell All City Data
/**
 * @swagger
 * /city:
 *   get:
 *     summary: Get all city Data
 *     tags: [City]
 *     security: []
 *     responses:
 *       200:
 *         description: List of city
 */
router.get("/", controller.getAllCity);

/**
 * @swagger
 * /city/by-state/{stateId}:
 *   get:
 *     summary: Get cities by stateId
 *     tags: [City]
 *     parameters:
 *       - in: path
 *         name: stateId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the state
 *     responses:
 *       200:
 *         description: List of cities for the given stateId
 *       404:
 *         description: No cities found
 */
router.get("/by-state/:stateId", controller.getCityByStateId);


export default router;
