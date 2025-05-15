import { Context } from "koa";
import { Category } from "../models/category";

interface categoryAttributes {
  id?: number;
  name: string;
}

// Add Category Data
const addCategoryData = async (ctx: Context) => {
  try {
    const { name } = ctx.request.body as categoryAttributes;

    if (!name) {
      ctx.status = 400;
      ctx.body = {
        status: false,
        message: "Category name is required",
      };
      return;
    }

    // Check if the category already exists
    const existingCategory = await Category.findOne({ where: { name } });

    if (existingCategory) {
      ctx.status = 409; // Conflict
      ctx.body = {
        status: false,
        message: "Category already exists",
      };
      return;
    }
    const addData: any = {
      name,
    };

    const newCategory = await Category.create(addData);

    ctx.status = 201;
    ctx.body = {
      status: true,
      message: "Category created successfully",
      data: newCategory,
    };
  } catch (error) {
    console.error("err -> ", error);
    ctx.status = 400;
    ctx.body = {
      status: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

//Get All Categories Data
const getAllCategoryData = async (ctx: Context) => {
  try {
    const findCategoryData = await Category.findAll({
      attributes: ["id", "name"],
    });

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "All Categories Fetched",
      data: findCategoryData,
    };
  } catch (error) {
    console.error("err -> ", error);
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    };
  }
};

export = {
  addCategoryData,
  getAllCategoryData,
};
