import { Context } from "koa";
import Orders from "../models/order";
import Transaction from "../models/transaction";
import Product from "../models/product";

//Gell All Order Data
const getAllOrder = async (ctx: Context) => {
  try {
    const findOrderData = await Orders.findAll({
      include: [
        {
          model: Transaction,
        },
        {
          model: Product,
        },
      ],
    });

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "All Order Fetched",
      data: findOrderData,
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
  getAllOrder,
};
