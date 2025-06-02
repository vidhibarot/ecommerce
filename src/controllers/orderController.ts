import { Context } from "koa";
import Orders from "../models/order";
import Transaction from "../models/transaction";
import Product from "../models/product";
import DeliveryCharges from "../models/deliverycharges";
import { STATUSDATA } from "../config/constant";
import User from "../models/user";
import { ORDERSTATUS, PAYMEMENTSTATUS } from "../config/constant";
const Razorpay = require('razorpay');

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

const status = {
  INPROGRESS: "Inprogress",
  SHIPPED: "Shipped",
  DELIVERD: "Delivered",
  CANCELLED: "Cancelled",
};

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

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

    const statusCounts = findOrderData.reduce(
      (acc, order) => {
        const orderStatus = order.status;
        if (orderStatus === status.INPROGRESS) acc.inprogress++;
        if (orderStatus === status.SHIPPED) acc.shipped++;
        if (orderStatus === status.DELIVERD) acc.delivered++;
        if (orderStatus === status.CANCELLED) acc.cancelled++;
        acc.total++;
        return acc;
      },
      {
        total: 0,
        inprogress: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      }
    );
    const userIds = [...new Set(findOrderData.map((order) => order.userId))];

    const users = await User.findAll({
      where: { id: userIds },
    });

    const userMap: any = users.reduce((acc: any, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    const ordersWithUser = findOrderData.map((order) => ({
      ...order.toJSON(),
      user: userMap[order.userId] || null,
    }));

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "All Order Fetched",
      data: ordersWithUser,
      count: statusCounts,
      totalOrders: findOrderData.length,
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

//Order Payment
const orderPayment = async (ctx: Context) => {
  try {
    const { orderId, paymentId, amount, paymentMethod } = ctx.request.body as any;

    const status = paymentId ? PAYMEMENTSTATUS.SUCCESS : PAYMEMENTSTATUS.FAILED;

    // Create a new transaction
    await Transaction.create({
      orderId: orderId,
      paymentId: paymentId || null,
      paymentMethod: paymentMethod || "Razorpay",
      transationId: Date.now().toString(),
      status,
      amount,
    });

    const updatedOrderStatus = paymentId
      ? ORDERSTATUS.INPROGRESS
      : ORDERSTATUS.FAILED;

    await Orders.update(
      { status: updatedOrderStatus },
      { where: { id: orderId } }
    );

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: paymentId
        ? "Payment successful. Order status updated to Inprogress."
        : "Payment failed. Order status updated to Failed.",
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error.message || "Internal Server Error",
    };
  }
};

//Payment Refund
const refundPayment = async (ctx: Context) => {
  const { paymentId } = ctx.request.body as any;

  if (!paymentId) {
    ctx.status = 400;
    ctx.body = { message: 'paymentId is required' };
    return;
  }

  try {
    const refund = await razorpay.payments.refund(paymentId);
    ctx.status = 200;
    ctx.body = {
      message: 'Refund processed successfully',
      refund,
    };
  } catch (err:any) {
    console.error('Refund Error:', err);
    ctx.status = 500;
    ctx.body = {
      message: 'Refund failed',
      error: err.message,
    };
  }
};


export = {
  getAllOrder,
  addOrder,
  orderPayment,
  refundPayment,
};
