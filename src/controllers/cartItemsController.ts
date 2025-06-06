import { Context } from "koa";
import CartItems from "../models/cartItems";
import Product from "../models/product";
import { STATUS_CODES } from "../config/constant";

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
      ctx.status = STATUS_CODES.NOT_FOUND;
      ctx.body = {
        status: false,
        message: "Cart item not found or does not belong to this user",
      };
      return;
    }

    cartItem.quantity = quantity || cartItem.quantity;
    await cartItem.save();

    ctx.status = STATUS_CODES.SUCCESS;
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
      ctx.status = STATUS_CODES.NOT_FOUND;
      ctx.body = {
        status: false,
        message: "Cart item not found or does not belong to this user",
      };
      return;
    }

    await cartItem.destroy();

    ctx.status = STATUS_CODES.SUCCESS;
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
      include: [
        {
          model: Product,
        },
      ],
    });

    if (cartItem.length == 0) {
      ctx.status = STATUS_CODES.NOT_FOUND;
      ctx.body = {
        status: false,
        message: "Cart item not found or does not belong to this user",
      };
      return;
    }

    ctx.status = STATUS_CODES.SUCCESS;
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

// Delete User CartItems Data
const deleteUserCartItems = async (ctx: Context) => {
  try {
    await CartItems.destroy({
      where: {
        userId: ctx?.state?.user?.id,
      },
    });

    ctx.status = STATUS_CODES.SUCCESS;
    ctx.body = {
      status: true,
      message: "Cart items deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting cart items:", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

//Get CartItems Total Order Summary Data
const getCartTotalSummary = async (ctx: Context) => {
  try {
    const userId = ctx.state.user.id;

    const cartItems = await CartItems.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ["id", "price", "discount"],
        },
      ],
    });


    let totalWithoutDiscount = 0;
    let totalDiscount = 0;
    let totalAfterDiscount = 0;

    const cartDetails = cartItems.map((item: any) => {
      const product = item.Product;
      const quantity = item.quantity;

      const price = product.price;
      const discountPrice = product.discount;
      const priceAfterDiscount = price - discountPrice;

      const lineTotalWithoutDiscount = price * quantity;
      const lineDiscount = discountPrice * quantity;
      const lineTotalAfterDiscount = priceAfterDiscount * quantity;

      totalWithoutDiscount += lineTotalWithoutDiscount;
      totalDiscount += lineDiscount;
      totalAfterDiscount += lineTotalAfterDiscount;


      return {
        productId: product.id,
        quantity,
        price,
        discountPrice,
        priceAfterDiscount,
        lineTotalWithoutDiscount,
        lineDiscount,
        lineTotalAfterDiscount,
      };
    });

    ctx.body = {
      status: true,
      cartTotalSummary: {
        totalWithoutDiscount,
        totalDiscount,
        totalAfterDiscount,
      },
      // cartDetails,
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: "Failed to fetch cart summary",
      error: error.message,
    };
  }
};

export = {
  addCartItems,
  updateCartItems,
  deleteCartItems,
  getCartItems,
  deleteUserCartItems,
  getCartTotalSummary,
};
