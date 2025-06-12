import { Context } from "koa";
import { User } from "../models/user";
import { Role } from "../models/role";
import { Op } from "sequelize";
import { ROLE_TYPES_ID, USERSTATUS } from "../config/constant";
import moment from "moment";
import Orders from "../models/order";
import Sequelize from "sequelize";

interface userAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: number;
}

//Gell All Users Data
const getAllUser = async (ctx: Context) => {
  try {
    const findUsers = await User.findAll();

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "All Users Fetched",
      data: findUsers,
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

//Get User Profile
const getUserProfile = async (ctx: Context) => {
  try {
    const { id } = ctx.state.user;

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        status: false,
        message: "id not found!",
      };
      return;
    }

    const getUserInfo = await User.findOne({
      where: { id },
      raw: false,
      nest: true,
      attributes: ["id", "name", "roleId", "email", "password"],
      include: [
        {
          model: Role,
          as: "role_info",
          attributes: ["name"],
        },
      ],
    });

    if (getUserInfo) {
      ctx.status = 200;
      ctx.body = {
        status: true,
        message: "User retrieved successfully",
        data: getUserInfo,
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: true,
        message: "No user found with the provided ID",
      };
    }
  } catch (error) {
    console.error("err -> ", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    };
  }
};

//Update User Profile
const updateUserProfile = async (ctx: Context) => {
  try {
    const { id } = ctx.state.user;
    const { name, email } = ctx.request.body as userAttributes;

    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      ctx.status = 404;
      ctx.body = { status: false, message: "User Not Found" };
      return;
    }

    const checkEmailExist = await User.findOne({
      where: {
        email,
        id: { [Op.ne]: id },
      },
      raw: true,
    });

    if (checkEmailExist) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Email Already Exists" };
      return;
    }

    const updateObject: any = {
      name,
      email,
    };

    const [updated] = await User.update(updateObject, { where: { id } });
    console.log("updateddddddd......", updated);
    if (updated) {
      ctx.status = 200;
      ctx.body = { status: true, message: "User Updated Successfully" };
    } else {
      ctx.status = 400;
      ctx.body = { status: false, message: "Something Went Wrong" };
    }
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { status: false, message: "Server Error" };
  }
};

//Gell All Customers Data
const getAllCustomers = async (ctx: Context) => {
  try {
    const findCustomers = await User.findAndCountAll({
      where: {
        roleId: ROLE_TYPES_ID.USER,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const newCustomersThisMonth = await User.count({
      where: {
        roleId: ROLE_TYPES_ID.USER,
        createdAt: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });
    const totalCustomers = await User.count({
      where: {
        roleId: ROLE_TYPES_ID.USER,
        status: USERSTATUS.ACTIVE,
      },
    });

    //  Find Customers with > 1 Order (Repeat Customers)
    const repeatCustomersData = await Orders.findAll({
      attributes: [
        "userId",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "orderCount"],
      ],
      group: ["userId"],
      having: Sequelize.literal("COUNT(id) > 1"),
    });

    const repeatCustomersCount = repeatCustomersData.length;

    const repeatPurchaseRate = totalCustomers
      ? ((repeatCustomersCount / totalCustomers) * 100).toFixed(2)
      : "0.00";
    console.log("repeatPurchaseRate", repeatPurchaseRate);

    const enrichedCustomers = await Promise.all(
      findCustomers.rows.map(async (customer: any) => {
        const orders = await Orders.findAll({
          where: { userId: customer.id },
          order: [["id", "DESC"]],
        });

        const totalOrders = orders.length;
        const totalExpense = orders.reduce(
          (sum: number, order: any) => sum + (Number(order.totalAmount) || 0),
          0
        );

        const lastOrder = orders[0];

        return {
          ...customer.toJSON(),
          totalOrders,
          totalExpense,
          lastOrderDate: lastOrder
            ? moment(lastOrder.dataValues.createdAt).format("YYYY-MM-DD")
            : null,
        };
      })
    );

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "All Customers Fetched",
      data: {
        count: findCustomers.count,
        rows: enrichedCustomers,
      },
      newCustomers: newCustomersThisMonth,
      repeatPurchasePercentage: `${repeatPurchaseRate}%`,
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

//Update User status
const updateUserStatus = async (ctx: Context) => {
  try {
    const { userId, status } = ctx.request.body as any;

    if (!userId || !status) {
      ctx.status = 400;
      ctx.body = { status: false, message: "userId and status are required" };
      return;
    }

    const userToUpdate = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!userToUpdate) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: "User not found or not a regular user",
      };
      return;
    }

    await User.update(
      { status },
      {
        where: {
          id: userId,
        },
      }
    );

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "User status updated successfully",
    };
  } catch (error) {
    console.error("Error updating user status:", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
};

export = {
  getAllUser,
  getUserProfile,
  updateUserProfile,
  getAllCustomers,
  updateUserStatus,
};
