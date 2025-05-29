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

// Update CartItems Data
const updateCartItems = async (ctx: Context) => {
  try {
    const { quantity } = ctx.request.body as Partial<cartItemsAttribute>;

    const cartItem = await CartItems.findOne({
      where: {
        id: ctx?.params?.cartId,
        userId: ctx?.state?.user?.id,
      },
    });

    if (!cartItem) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: "Cart item not found or does not belong to this user",
      };
      return;
    }

    cartItem.quantity = quantity || cartItem.quantity;
    await cartItem.save();

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Cart item updated successfully",
      data: cartItem,
    };
  } catch (error) {
    console.error("Error updating cart item:", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Delete CartItems Data
const deleteCartItems = async (ctx: Context) => {
  try {
    const cartId = ctx.params.cartId;
    const cartItem = await CartItems.findOne({
      where: {
        id: cartId,
        userId: ctx?.state?.user?.id,
      },
    });

    if (!cartItem) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: "Cart item not found or does not belong to this user",
      };
      return;
    }

    await cartItem.destroy();

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Cart item deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting cart item:", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

//Get CartItems Data
const getCartItems = async (ctx: Context) => {
  try {
    const cartItem = await CartItems.findAll({
      where: {
        userId: ctx?.state?.user?.id,
      },
    });

    if (cartItem.length == 0) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: "Cart item not found or does not belong to this user",
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Cart items fetched successfully",
      data: cartItem,
    };
  } catch (error) {
    console.error("Error get cart item:", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export = {
  addCartItems,
  updateCartItems,
  deleteCartItems,
  getCartItems,
};
