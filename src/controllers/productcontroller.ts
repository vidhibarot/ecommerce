import { Context } from "koa";
import { Op } from "sequelize";
import { Product } from "../models/product";
import { Category } from "../models/category";

interface ProductFilterRequest {
  filters?: FilterField[];
}

interface FilterField {
  id: string;
  value: string | number;
}

const getAllProduct = async (ctx: Context) => {
  try {
    const bodyData = ctx?.request?.body as ProductFilterRequest;

    const productWhere: any = {};
    const categoryWhere: any = {};

    if ((bodyData.filters ?? []).length > 0) {
        for (const filter of bodyData.filters!) {
          if (filter.id && filter.value !== "") {
            if (filter.id === "price") {
              productWhere["price"] = { [Op.lt]: filter.value };
            } else if (filter.id === "category.name" && typeof filter.value === "string") {
              categoryWhere["name"] = { [Op.like]: `%${filter.value.trim()}%` };
            } else {
              productWhere[filter.id] = {
                [Op.like]: `%${String(filter.value).trim()}%`,
              };
            }
          }
        }
      }
    const findProducts = await Product.findAll({
      where: productWhere,
      include: [
        {
          model: Category,
          where: Object.keys(categoryWhere).length > 0 ? categoryWhere : undefined,
        },
      ],
    });

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Filtered products fetched",
      data: findProducts,
      count: findProducts.length,
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
  getAllProduct,
};
