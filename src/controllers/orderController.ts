import { Context } from "koa";
import Orders from "../models/order";
import Transaction from "../models/transaction";
import Product from "../models/product";
import DeliveryCharges from "../models/deliverycharges";
import { STATUSDATA } from "../config/constant";
interface orderAttributes {
  id?: number;
  userId: number;
  productId: number;
  customerName: string;
  email: string;
  phoneno: string;
  address: any;
  quantity: number;
  price: number;
  deliveryCharges: number;
  totalAmount: number;
  status?: string;
}

//Add Order Data
const addOrder = async (ctx: Context) => {
  try {
    const {
      productId,
      customerName,
      email,
      phoneno,
      address,
      quantity,
      price,
    } = ctx.request.body as orderAttributes;

    const initialTotal = quantity * price;

    const deliveryChargeData = await DeliveryCharges.findOne({
      where: {
        city: address.city,
        zipcode: address.zipcode,
        status: STATUSDATA.ACTIVE,
      },
    });

    if (!deliveryChargeData) {
      ctx.status = 400;
      ctx.body = {
        status: false,
        message: "Delivery not available for the specified city or zipcode.",
      };
      return;
    }

    let deliveryCharges = 0;

    if (deliveryChargeData) {
      const minOrderValue = parseFloat(deliveryChargeData.minOrder);
      const chargeValue = parseFloat(deliveryChargeData.charge);

      if (initialTotal < minOrderValue) {
        deliveryCharges = chargeValue;
      }
    }

    const totalAmount = initialTotal + deliveryCharges;

    const newOrder = await Orders.create({
      userId: ctx.state.user.id,
      productId,
      customerName,
      email,
      phoneno,
      address: JSON.stringify(address),
      quantity,
      price,
      deliveryCharges,
      totalAmount,
    });

    ctx.status = 201;
    ctx.body = {
      status: true,
      message: "Order created successfully",
      data: newOrder,
    };
  } catch (error) {
    console.error("Add Order Error: ", error);
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

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
  addOrder,
};
