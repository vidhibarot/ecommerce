import Router from "koa-router";

const controller = require("../controllers/roleController");
const router = new Router({ prefix: "/role" });

// Get All Role Data 

/**
 * @swagger
 * /role/get:
 *   get:
 *     summary: Get role
 *     tags: [Role]
 *     security: []
 *     responses:
 *       200:
 *         description: Role Data fetched successfully
 *       404:
 *         description: Role not found
 */
router.get("/get", controller.getAllRoleData);

export default router;
