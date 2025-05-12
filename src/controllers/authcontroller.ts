import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Role } from "../models/role";
import dotenv from "dotenv";
import { Context } from "koa";
import { Op } from "sequelize";

dotenv.config();

interface userAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: number;
}

//Register User
const register = async (ctx: Context) => {
  try {
    const { name, email, password, roleId, confirmPassword } = ctx.request
      .body as userAttributes;

    const existingUser = await User.findOne({ where: { email }, raw: true });

    if (existingUser) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Email Already Exists" };
      return;
    }
    if (password !== confirmPassword) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Passwords do not match" };
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createObject: any = {
      name,
      email,
      roleId,
      password: hashedPassword,
    };

    const createdUser = await User.create(createObject);

    if (createdUser) {
      ctx.status = 200;
      ctx.body = { status: true, message: "Registered Successfully" };
    } else {
      ctx.status = 400;
      ctx.body = { status: false, message: "Something Went Wrong" };
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { status: false, message: "Server Error" };
  }
};

//Login User
const login = async (ctx: Context) => {
  try {
    const { email, password } = ctx.request.body as userAttributes;

    const existingUser = await User.findOne({ where: { email }, raw: true });
    if (!existingUser) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Email Not Found" };
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      ctx.status = 200;
      ctx.body = { status: false, message: "Incorrect Password" };
      return;
    }

    // Generate token
    const payload = {
      id: existingUser.id,
      email: existingUser.email,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    // Get role name
    const role = await Role.findOne({
      where: { id: existingUser.roleId },
      attributes: ["id", "name"],
      raw: true,
    });

    if (!role) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Invalid Role" };
      return;
    }

    // Final response
    const responseObj = {
      user_id: existingUser.id,
      email: existingUser.email,
      token: accessToken,
      refreshToken: refreshToken,
      roleName: role.name,
    };

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Login Successfully",
      data: responseObj,
    };
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { status: false, message: "Something went wrong" };
  }
};

//User forgot password
const forgotPassword = async (ctx: Context) => {
  try {
    const { email } = ctx.request.body as userAttributes;

    const user = await User.findOne({ where: { email }, raw: true });
    if (!user) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Email Not Found" };
      return;
    }

    // const OTP = await generateOtp(6);
    // await User.update({ otp: OTP, otp_expire_time: await otpExpTime() }, { where: { id: user.id } });

    // const templateData = { email, OTP };
    // await emailSender(email, EMAILCONSTANT.FORGOT_PASSWORD.subject, templateData, EMAILCONSTANT.FORGOT_PASSWORD.template);

    ctx.status = 200;
    ctx.body = { status: true, message: "OTP sent successfully to your email" };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { status: false, message: "Server Error" };
  }
};

//Update User By Id
const updateUserById = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
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

//Delete User BY Id
const deleteUserById = async (ctx: Context) => {
  try {
    const { name, email, password, roleId, confirmPassword } = ctx.request
      .body as userAttributes;

    const existingUser = await User.findOne({ where: { email }, raw: true });

    if (existingUser) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Email Already Exists" };
      return;
    }
    if (password !== confirmPassword) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Passwords do not match" };
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createObject: any = {
      name,
      email,
      roleId,
      password: hashedPassword,
    };

    const createdUser = await User.create(createObject);

    if (createdUser) {
      ctx.status = 200;
      ctx.body = { status: true, message: "Registered Successfully" };
    } else {
      ctx.status = 400;
      ctx.body = { status: false, message: "Something Went Wrong" };
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { status: false, message: "Server Error" };
  }
};

//Get User By Id
const getUserById = async (ctx: Context) => {
  try {
    const { id } = ctx.params;

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

export = {
  login,
  register,
  forgotPassword,
  updateUserById,
  deleteUserById,
  getUserById,
};
