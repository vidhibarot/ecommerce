import { Context } from "koa";
import Orders from "../models/order";
import Transaction from "../models/transaction";
import Product from "../models/product";
import DeliveryCharges from "../models/deliverycharges";
import { STATUSDATA } from "../config/constant";
import User from "../models/user";
import { ORDERSTATUS, PAYMEMENTSTATUS } from "../config/constant";
import { createHmac } from "crypto";
const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

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
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const secret: any = process.env.RAZORPAY_SECRET;

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
    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);

    const newOrder = await Orders.create({
      orderId: order.id,
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
      data: order,
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
    const orderIds = findOrderData.map((order) => order.orderId);

    const transactions = await Transaction.findAll({
      where: { orderId: orderIds },
    });

    const transactionMap: any = transactions.reduce((acc: any, tx: any) => {
      acc[tx.orderId] = tx;
      return acc;
    }, {});

    const ordersWithUser = findOrderData.map((order) => ({
      ...order.toJSON(),
      transaction: transactionMap[order.orderId] || null,
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

//Payment Refund
const refundPayment = async (ctx: Context) => {
  const { orderId } = ctx.params;
  console.log("orfedr isnnnnnn", orderId);
  try {
    const order = await Orders.findOne({
      where: { orderId },
    });

    if (!order) {
      ctx.throw(404, "Order not found");
    }

    const transaction: any = await Transaction.findOne({
      where: { orderId, status: PAYMEMENTSTATUS.SUCCESS },
    });

    if (!transaction) {
      ctx.throw(404, "Transaction not found");
    }

    const refund = await razorpay.payments.refund(transaction.paymentId, {
      amount: transaction.amount * 100,
      speed: "normal",
    });

    transaction.status = PAYMEMENTSTATUS.REFUNDED;
    await transaction.save();

    order.status = ORDERSTATUS.CANCELLED;
    await order.save();

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Refund successful and order cancelled",
      refund,
    };
  } catch (error: any) {
    console.error("Refund error:", error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "Refund failed",
      error: error?.message || "Internal Server Error",
    };
  }
};

//Verify Payment
const verifyPayment = async (ctx: any) => {
  const { orderId, paymentId, transactionId, amount } = ctx.request.body;

  if (!orderId || !paymentId || !transactionId || !amount) {
    ctx.status = 400;
    ctx.body = { success: false, message: "Missing payment details." };
    return;
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const status =
    expectedSignature === transactionId
      ? PAYMEMENTSTATUS.SUCCESS
      : PAYMEMENTSTATUS.FAILED;

  await Transaction.create({
    orderId,
    paymentId,
    transationId: transactionId,
    paymentMethod: "RAZORPAY",
    status,
    amount,
  });

  const orderStatus =
    status === PAYMEMENTSTATUS.SUCCESS
      ? ORDERSTATUS.INPROGRESS
      : ORDERSTATUS.FAILED;

  await Orders.update({ status: orderStatus }, { where: { orderId } });

  if (status === PAYMEMENTSTATUS.SUCCESS) {
    ctx.body = { success: true, message: "Payment verified successfully!" };
  } else {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: "Signature mismatch. Verification failed.",
    };
  }
};

//Gell User Orders Data
const getUsersOrder = async (ctx: Context) => {
  try {
    const userId = ctx.state.user.id;

    const findOrderData = await Orders.findAll({
      where: { userId },
      include: [{ model: Product }], // Only include Product
    });

    const orderIds = findOrderData.map((order) => order.orderId);

    const transactions = await Transaction.findAll({
      where: { orderId: orderIds },
    });

    const transactionMap: any = transactions.reduce((acc: any, tx: any) => {
      acc[tx.orderId] = tx;
      return acc;
    }, {});

    const ordersWithUser = findOrderData.map((order) => ({
      ...order.toJSON(),
      transaction: transactionMap[order.orderId] || null,
    }));

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "All Order Fetched",
      data: ordersWithUser,
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
  refundPayment,
  verifyPayment,
  getUsersOrder,
};
