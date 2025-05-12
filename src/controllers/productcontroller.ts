import { Context } from "koa";
import { User } from "../models/user";
import { Role } from "../models/role";
import { Op } from "sequelize";

interface userAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: number;
}

const getAllProduct = async (ctx: Context) => {
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
export = {
  getAllProduct,
  getUserProfile,
  updateUserProfile,
};
