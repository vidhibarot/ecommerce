import { Context } from "koa";
import moment from "moment";
import Orders from "../models/order";
import { Op, fn, col, literal } from "sequelize";
import Product from "../models/product";
import Transaction from "../models/transaction";
import {
  ORDERSTATUS,
  PAYMEMENTSTATUS,
  ROLE_TYPES_ID,
  USERSTATUS,
} from "../config/constant";
import User from "../models/user";
import OrderItems from "../models/orderItems";

//Gell Dashboard Data
const getDashboardData = async (ctx: Context) => {
  try {
    const startOfThisMonth = moment().startOf("month").toDate();
    const endOfThisMonth = moment().endOf("month").toDate();

    const startOfLastMonth = moment()
      .subtract(1, "month")
      .startOf("month")
      .toDate();
    const endOfLastMonth = moment()
      .subtract(1, "month")
      .endOf("month")
      .toDate();

    // Current month order count
    const thisMonthOrdersCount = await Orders.count({
      where: {
        createdAt: {
          [Op.between]: [startOfThisMonth, endOfThisMonth],
        },
        status: ORDERSTATUS.DELIVERD,
      },
    });

    // Last month order count
    const lastMonthOrdersCount = await Orders.count({
      where: {
        createdAt: {
          [Op.between]: [startOfLastMonth, endOfLastMonth],
        },
        status: ORDERSTATUS.DELIVERD,
      },
    });

    // Find percentage of Increment decrement for orders
    let orderPercentageChange = "0.00";
    if (lastMonthOrdersCount > 0) {
      orderPercentageChange = (
        ((thisMonthOrdersCount - lastMonthOrdersCount) / lastMonthOrdersCount) *
        100
      ).toFixed(2);
    }

    // Current month income
    const totalIncomeResult: any = await Transaction.findOne({
      attributes: [[fn("SUM", col("amount")), "totalIncome"]],
      where: {
        createdAt: { [Op.between]: [startOfThisMonth, endOfThisMonth] },
        status: PAYMEMENTSTATUS.SUCCESS,
      },
      raw: true,
    });
    const totalRevenue = Number(totalIncomeResult?.totalIncome || 0);

    // Last month income
    const lastMonthIncomeResult: any = await Transaction.findOne({
      attributes: [[fn("SUM", col("amount")), "totalIncome"]],
      where: {
        createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] },
        status: PAYMEMENTSTATUS.SUCCESS,
      },
      raw: true,
    });
    const lastMonthRevenue = Number(lastMonthIncomeResult?.totalIncome || 0);

    // Income percenetage compare to last month
    let revenuePercentageChange = "0.00";
    if (lastMonthRevenue > 0) {
      revenuePercentageChange = (
        ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) *
        100
      ).toFixed(2);
    }

    // Current month new customers
    const customersCount: any = await User.count({
      where: {
        roleId: ROLE_TYPES_ID.USER,
        createdAt: { [Op.between]: [startOfThisMonth, endOfThisMonth] },
        status: USERSTATUS.ACTIVE,
      },
    });

    // Last month customers count
    const lastMonthCustomersCount = await User.count({
      where: {
        roleId: ROLE_TYPES_ID.USER,
        createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] },
        status: USERSTATUS.ACTIVE,
      },
    });

    // Customer percentage comapre to last month
    const customersPercentageChange =
      lastMonthCustomersCount > 0
        ? (
            ((customersCount - lastMonthCustomersCount) /
              lastMonthCustomersCount) *
            100
          ).toFixed(2)
        : "0.00";

    // Current month average orders value
    const avgOrderValue =
      thisMonthOrdersCount > 0
        ? (totalRevenue / thisMonthOrdersCount).toFixed(2)
        : "0.00";
    console.log("vvvvvvv", avgOrderValue);

    // Last month average order value
    const lastMonthAvgOrderValue =
      lastMonthOrdersCount > 0
        ? (lastMonthRevenue / lastMonthOrdersCount).toFixed(2)
        : "0.00";

    // Average order percentage compare to last month
    const avgOrderValuePercentageChange =
      Number(lastMonthAvgOrderValue) > 0
        ? (
            ((Number(avgOrderValue) - Number(lastMonthAvgOrderValue)) /
              Number(lastMonthAvgOrderValue)) *
            100
          ).toFixed(2)
        : "0.00";

    //Get monthly sales of last 6 months
    const startOfSixMonthsAgo = moment()
      .subtract(5, "months")
      .startOf("month")
      .toDate();

    const monthlySales = await Orders.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "month"], // Format as "YYYY-MM"
        [fn("SUM", col("totalAmount")), "totalSales"],
      ],
      where: {
        status: ORDERSTATUS.DELIVERD,
        createdAt: {
          [Op.between]: [startOfSixMonthsAgo, endOfThisMonth],
        },
      },
      group: [fn("DATE_FORMAT", col("createdAt"), "%Y-%m")],
      order: [[fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "ASC"]],
      raw: true,
    });

    console.log("monthlySales", monthlySales);

    const formattedMonthlySales = monthlySales.map((item: any) => ({
      month: moment(item.month, "YYYY-MM").format("MMM YYYY"),
      totalSales: Number(item.totalSales || 0),
    }));

    console.log("formated monthaly slaesssss...", formattedMonthlySales);

    const topProducts = await OrderItems.findAll({
      attributes: ["productId", [fn("SUM", col("quantity")), "totalSold"]],
      include: [
        {
          model: Orders,
          attributes: [],
          where: {
            status: ORDERSTATUS.DELIVERD,
          },
        },
        {
          model: Product,
          attributes: ["name"],
        },
      ],
      group: ["productId", "Product.id", "Product.name"],
      order: [[literal("totalSold"), "DESC"]],
      limit: 5,
    });

    // Recent orders
    const recentOrders = await Orders.findAll({
      //   where: {
      //     status: ORDERSTATUS.INPROGRESS,
      //   },
      order: [["id", "DESC"]],
      limit: 5,
    });

    // Low stock products
    const lowStocks = await Product.findAll({
      where: {
        inStock: {
          [Op.lte]: 5,
        },
      },
    });

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Order Count Comparison",
      data: {
        totalRevenue,
        revenuePercentageChange,
        thisMonthOrdersCount,
        orderPercentageChange,
        customersCount,
        customersPercentageChange,
        avgOrderValue,
        avgOrderValuePercentageChange,
        recentOrders,
        lowStocks,
        formattedMonthlySales,
        topProducts,
      },
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
  getDashboardData,
};
