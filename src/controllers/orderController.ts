import { Context } from "koa";
import Orders from "../models/order";
import Transaction from "../models/transaction";
import Product from "../models/product";
import DeliveryCharges from "../models/deliverycharges";
import { PAYMENTMETHOD, STATUSDATA } from "../config/constant";
import User from "../models/user";
import { ORDERSTATUS, PAYMEMENTSTATUS } from "../config/constant";
import { createHmac } from "crypto";
import OrderItems from "../models/orderItems";
const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

interface orderAttributes {
  products: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  userId?: number;
  customerName: string;
  email: string;
  phoneno: string;
  address: {
    city: string;
    zipcode: string;
    [key: string]: any;
  };
  deliveryCharges?: number;
  totalAmount?: number;
  status?: string;
  paymentMethod: string;
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
// const addOrder = async (ctx: Context) => {
//   try {
//     const {
//       productId,
//       customerName,
//       email,
//       phoneno,
//       address,
//       quantity,
//       price,
//       paymentMethod,
//     } = ctx.request.body as orderAttributes & { paymentMethod: string };

//     const initialTotal = quantity * price;

//     const deliveryChargeData = await DeliveryCharges.findOne({
//       where: {
//         city: address.city,
//         zipcode: address.zipcode,
//         status: STATUSDATA.ACTIVE,
//       },
//     });

//     if (!deliveryChargeData) {
//       ctx.status = 400;
//       ctx.body = {
//         status: false,
//         message: "Delivery not available for the specified city or zipcode.",
//       };
//       return;
//     }

//     let deliveryCharges = 0;
//     if (deliveryChargeData) {
//       const minOrderValue = parseFloat(deliveryChargeData.minOrder);
//       const chargeValue = parseFloat(deliveryChargeData.charge);

//       if (initialTotal < minOrderValue) {
//         deliveryCharges = chargeValue;
//       }
//     }

//     const totalAmount = initialTotal + deliveryCharges;

//     let razorpayOrder = null;

//     if (paymentMethod === PAYMENTMETHOD.ONLINE) {
//       const options = {
//         amount: totalAmount * 100,
//         currency: "INR",
//         receipt: `rcpt_${Date.now()}`,
//         payment_capture: 1,
//       };

//       razorpayOrder = await razorpayInstance.orders.create(options);
//     }

//     const newOrder = await Orders.create({
//       orderId: razorpayOrder ? razorpayOrder.id : `cod_${Date.now()}`,
//       userId: ctx.state.user.id,
//       // productId,
//       customerName,
//       email,
//       phoneno,
//       address: JSON.stringify(address),
//       quantity,
//       price,
//       deliveryCharges,
//       totalAmount,
//       status: paymentMethod === PAYMENTMETHOD.COD ? ORDERSTATUS.INPROGRESS : ORDERSTATUS.INPROGRESS, // Default to in-progress if COD
//     });

//     // Add COD Transaction if needed
//     if (paymentMethod === PAYMENTMETHOD.COD) {
//       await Transaction.create({
//         orderId: newOrder.orderId,
//         paymentId: "",
//         transationId: "",
//         paymentMethod: PAYMENTMETHOD.COD,
//         status: PAYMEMENTSTATUS.INPROGRESS,
//         amount: totalAmount.toString(),
//       });
//     }

//     ctx.status = 201;
//     ctx.body = {
//       status: true,
//       message: "Order created successfully",
//       data: paymentMethod === "COD" ? newOrder : razorpayOrder,
//     };
//   } catch (error) {
//     console.error("Add Order Error: ", error);
//     ctx.status = 400;
//     ctx.body = {
//       status: false,
//       message: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// };
const addOrder = async (ctx: Context) => {
  try {
    const { products, customerName, email, phoneno, address, paymentMethod } =
      ctx.request.body as orderAttributes;

    if (!products || !Array.isArray(products) || products.length === 0) {
      ctx.status = 400;
      ctx.body = {
        status: false,
        message: "No products found in the order.",
      };
      return;
    }

    const initialTotal = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

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
    const minOrderValue = parseFloat(deliveryChargeData.minOrder);
    const chargeValue = parseFloat(deliveryChargeData.charge);

    if (initialTotal < minOrderValue) {
      deliveryCharges = chargeValue;
    }

    const totalAmount = initialTotal + deliveryCharges;

    let razorpayOrder = null;

    if (paymentMethod === PAYMENTMETHOD.ONLINE) {
      const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        payment_capture: 1,
      };
      razorpayOrder = await razorpayInstance.orders.create(options);
    }

    const order: any = await Orders.create({
      orderId: razorpayOrder ? razorpayOrder.id : `cod_${Date.now()}`,
      userId: ctx.state.user.id,
      customerName,
      email,
      phoneno,
      address: JSON.stringify(address),
      deliveryCharges,
      totalAmount,
      status: ORDERSTATUS.INPROGRESS,
    });

    for (const item of products) {
      await OrderItems.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    if (paymentMethod === PAYMENTMETHOD.COD) {
      await Transaction.create({
        orderId: order.orderId,
        paymentId: "",
        transationId: "",
        paymentMethod: PAYMENTMETHOD.COD,
        status: PAYMEMENTSTATUS.INPROGRESS,
        amount: totalAmount.toString(),
      });
    }

    ctx.status = 201;
    ctx.body = {
      status: true,
      message: "Order created successfully",
      data: paymentMethod === PAYMENTMETHOD.COD ? order : razorpayOrder,
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
          model: OrderItems,
          include: [
            {
              model: Product,
            },
          ],
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
      include: [
        {
          model: OrderItems,
          include: [
            {
              model: Product,
            },
          ],
        },
      ],
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

const razorpayWebhook = async (ctx: Context) => {
  const body = ctx.request.body as any;
  const razorpaySignature = ctx.request.headers["x-razorpay-signature"];
  const rawBody = ctx.state.rawBody;

  const expectedSignature = createHmac("sha256", process.env.RAZORPAY_SECRET!)
    .update(rawBody)
    .digest("hex");

  console.log("razorpaySignaturerazorpaySignature..", razorpaySignature);

  console.log("exprected signaturererrerererer..", expectedSignature);

  if (razorpaySignature !== expectedSignature) {
    ctx.status = 400;
    ctx.body = { success: false, message: "Invalid signature" };
    return;
  }

  const event = body.event;

  if (event === "payment.captured") {
    console.log("in capturedddddd,,,,,,,,,");
    const payment = body.payload.payment.entity;
    const amount = payment.amount / 100;

    await Transaction.create({
      orderId: "null",
      paymentId: payment.id,
      transationId: payment.id,
      paymentMethod: "online",
      status: PAYMEMENTSTATUS.SUCCESS,
      amount: amount.toString(),
    });

    console.log("✅ Webhook processed: payment.captured");
  }
  if (event === "payment.refunded") {
    console.log("in refunded,refunded,,,,,,,,");

    const payment = body.payload.payment.entity;

    await Transaction.update(
      { status: PAYMEMENTSTATUS.REFUNDED },
      { where: { paymentId: payment.id } }
    );

    const transaction = await Transaction.findOne({
      where: { paymentId: payment.id },
    });
    if (transaction?.orderId) {
      await Orders.update(
        { status: ORDERSTATUS.CANCELLED },
        { where: { id: transaction.orderId } }
      );
    }

    ctx.status = 200;
    ctx.body = { success: true };
  }

  ctx.status = 200;
  ctx.body = { success: true };
};

export = {
  getAllOrder,
  addOrder,
  refundPayment,
  verifyPayment,
  getUsersOrder,
  razorpayWebhook,
};
