import { Context } from "koa";
import { Role } from "../models/role";

// Get Store
const getAllRoleData = async (ctx: Context) => {
  try {

    const roleData = await Role.findAll()

    if (!roleData) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: `No Data is there`,
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: `Role Data fetched successfully`,
      data: roleData,
    };
  } catch (error) {
    console.error("Error -> ", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
};

export = {
  getAllRoleData,
};
