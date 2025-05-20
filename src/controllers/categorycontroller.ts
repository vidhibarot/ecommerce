import { Context } from "koa";
import { Category } from "../models/category";
import SubCategory from "../models/subCategory";

interface categoryAttributes {
  id?: number;
  name: string;
  subcategory?: string[];
}

// Add Category Data
const addCategoryData = async (ctx: Context) => {
  try {
    const { name, subcategory } = ctx?.request?.body as categoryAttributes;

    if (!name) {
      ctx.status = 400;
      ctx.body = {
        status: false,
        message: "Category name is required",
      };
      return;
    }

    const existingCategory = await Category.findOne({ where: { name } });

    if (existingCategory) {
      ctx.status = 409;
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

    if (Array.isArray(subcategory) && subcategory.length > 0) {
      const subcategoryData = subcategory.map((subcatName: string) => ({
        name: subcatName,
        categoryId: newCategory?.id,
      }));

      await SubCategory.bulkCreate(subcategoryData);
    }

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

// Update Category Data
const updateCategoryData = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const { name, subcategory } = ctx.request.body as categoryAttributes;
    console.log("id nammammammamma", id, ctx.params.id);
    if (!id || !name) {
      ctx.status = 400;
      ctx.body = {
        status: false,
        message: "Category ID and name are required",
      };
      return;
    }

    const category = await Category.findByPk(id);
    if (!category) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: "Category not found",
      };
      return;
    }

    // Check for duplicate name
    const duplicate = await Category.findOne({ where: { name } });
    if (duplicate && duplicate.id !== id) {
      ctx.status = 409;
      ctx.body = {
        status: false,
        message: "Category is Already Exists",
      };
      return;
    }

    category.name = name;
    await category.save();

    if (Array.isArray(subcategory)) {
      await SubCategory.destroy({ where: { categoryId: id } });

      if (subcategory.length > 0) {
        const subcategoryData = subcategory.map((subcatName: string) => ({
          name: subcatName,
          categoryId: id,
        }));
        await SubCategory.bulkCreate(subcategoryData);
      }
    }

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Category updated successfully",
      data: category,
    };
  } catch (error) {
    console.error("err -> ", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Delete Category Data
const deleteCategoryData = async (ctx: Context) => {
  try {
    const id = Number(ctx.params.id);
    if (!id) {
      ctx.status = 400;
      ctx.body = {
        status: false,
        message: "Category ID is required",
      };
      return;
    }

    const category = await Category.findByPk(id);
    if (!category) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: "Category not found",
      };
      return;
    }

    await SubCategory.destroy({ where: { categoryId: id } });

    await category.destroy();

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Category deleted successfully",
    };
  } catch (error) {
    console.error("err -> ", error);
    ctx.status = 500;
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
      include: [
        {
          model: SubCategory,
          attributes: ["id", "name", "categoryId"],
        },
      ],
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

//Get Category Data By Id
const getCategoryById = async (ctx: Context) => {
  try {
    const id = ctx.params.id;

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        status: false,
        message: "Category ID is required",
      };
      return;
    }

    const category = await Category.findByPk(id, {
      include: [
        {
          model: SubCategory,
        },
      ],
    });

    if (!category) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: "Category not found",
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Category fetched successfully",
      data: category,
    };
  } catch (error) {
    console.error("err -> ", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export = {
  addCategoryData,
  updateCategoryData,
  deleteCategoryData,
  getAllCategoryData,
  getCategoryById,
};
