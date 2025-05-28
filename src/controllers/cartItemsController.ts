import { Context } from "koa";
import CartItems from "../models/cartItems";

interface cartItemsAttribute {
  id?: number;
  userId: number;
  productId: number;
  quantity: number;
}

// Add CartItems Data
const addCartItems = async (ctx: Context) => {
  try {
    const { productId, quantity } = ctx?.request?.body as cartItemsAttribute;

    const addData: any = {
      userId: ctx?.state?.user?.id,
      productId,
      quantity,
    };

    const newCategory = await CartItems.create(addData);

    ctx.status = 201;
    ctx.body = {
      status: true,
      message: "Cart created successfully",
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

export = {
  addCartItems,
};
