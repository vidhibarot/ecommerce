import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Role } from "../models/role";
import dotenv from "dotenv";
import { Context } from "koa";
import { Op } from "sequelize";
import { EMAILCONSTANT, ROLE_TYPES_ID } from "../config/constant";
import { emailSender } from "../middleware/email.helper";
import { generateCustomPassword, generateOtp } from "../middleware/helper";
import moment from "moment";

dotenv.config();

interface userAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  phoneno: string;
  confirmPassword: string;
  roleId: number;
  adminPassword?: string;
  otp?: string;
  otp_expire_time?: Date;
}

// Register User
const register = async (ctx: Context) => {
  try {
    let {
      name,
      email,
      password,
      phoneno,
      roleId,
      confirmPassword,
      adminPassword,
    } = ctx.request.body as userAttributes;

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
    if (adminPassword) {
      if (adminPassword === process.env.ADMIN_SECRET) {
        roleId = ROLE_TYPES_ID.ADMIN;
      } else {
        ctx.status = 403;
        ctx.body = {
          status: false,
          message: "Please enter valid Admin Password",
        };
        return;
      }
    } else {
      roleId = ROLE_TYPES_ID.USER;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createObject: any = {
      name,
      email,
      roleId,
      phoneno,
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

// Login User
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

    var date = new Date();

    await User.update({ updatedAt: date }, { where: { id: existingUser.id } });

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

// User forgot password
const forgotPassword = async (ctx: Context) => {
  try {
    const { email } = ctx.request.body as userAttributes;
    const OTP: any = await generateOtp(6);

    const user = await User.findOne({ where: { email }, raw: true });
    if (!user) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Email Not Found" };
      return;
    }
    var date = new Date();
    date.setMinutes(date.getMinutes() + 2);

    await User.update(
      { otp: OTP, otp_expire_time: date },
      { where: { id: user.id } }
    );

    const templateData = { email, OTP };

    await emailSender(
      email,
      EMAILCONSTANT.FORGOT_PASSWORD.subject,
      templateData,
      EMAILCONSTANT.FORGOT_PASSWORD.template
    );

    ctx.body = {
      status: true,
      message: "OTP sent successfully to your email",
    };
  } catch (error) {
    console.error(error);
    ctx.status = 400;
    ctx.body = { status: false, message: "Something went wrong" };
  }
};

// Resend Otp api
const resendOTP = async (ctx: Context) => {
  try {
    const { email } = ctx.request.body as userAttributes;
    const OTP: any = await generateOtp(6);

    const user = await User.findOne({ where: { email }, raw: true });
    if (!user) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Email Not Found" };
      return;
    }

    var date = new Date();
    date.setMinutes(date.getMinutes() + 2);

    await User.update(
      { otp: OTP, otp_expire_time: date },
      { where: { id: user.id } }
    );

    const templateData = { email, OTP };

    await emailSender(
      email,
      EMAILCONSTANT.RESEND_OTP.subject,
      templateData,
      EMAILCONSTANT.RESEND_OTP.template
    );

    ctx.body = {
      status: true,
      message: "OTP resent successfully to your email",
    };
  } catch (error) {
    console.error(error);
    ctx.status = 400;
    ctx.body = { status: false, message: "Something went wrong" };
  }
};

// Verify User Otp
const verifyOtp = async (ctx: Context) => {
  try {
    const { email, otp } = ctx.request.body as userAttributes;

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "otp", "otp_expire_time"],
      raw: true,
    });
    if (!user) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Email Not Found" };
      return;
    }

    if (moment(user.otp_expire_time).isBefore(moment())) {
      ctx.status = 400;
      ctx.body = { status: false, message: "OTP Expired" };
      return;
    }

    if (otp != user.otp) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Invalid OTP" };
      return;
    }

    await User.update(
      { otp: null, otp_expire_time: null },
      { where: { id: user.id } }
    );

    ctx.body = {
      status: true,
      message: "OTP Verified Successfully",
    };
  } catch (error) {
    console.error(error);
    ctx.status = 400;
    ctx.body = { status: false, message: "Something went wrong" };
  }
};

// User Reset password
const resetPassword = async (ctx: Context) => {
  try {
    const { email, password } = ctx.request.body as userAttributes;

    const user = await User.findOne({
      where: { email },
      attributes: ["id"],
      raw: true,
    });
    if (!user) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Email Not Found" };
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.update({ password: hashedPassword }, { where: { id: user.id } });

    ctx.body = {
      status: true,
      message: "Password reset successfully",
    };
  } catch (error) {
    console.error(error);
    ctx.status = 400;
    ctx.body = { status: false, message: "Something went wrong" };
  }
};

// Update User By Id
const updateUserById = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const { name, email, phoneno } = ctx.request.body as userAttributes;

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
      phoneno,
    };

    const [updated] = await User.update(updateObject, { where: { id } });
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

// Delete User BY Id
const deleteUserById = async (ctx: Context) => {
  try {
    const { id } = ctx.params;

    if (!id) {
      ctx.status = 400;
      ctx.body = { status: false, message: "User ID is required" };
      return;
    }

    const user = await User.findByPk(id);

    if (!user) {
      ctx.status = 404;
      ctx.body = { status: false, message: "User not found" };
      return;
    }

    await user.destroy();

    ctx.status = 200;
    ctx.body = { status: true, message: "User deleted successfully" };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { status: false, message: "Internal Server Error" };
  }
};

// Get User By Id
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
    });

    if (getUserInfo) {
      const role = await Role.findOne({
        where: { id: getUserInfo?.roleId },
        attributes: ["id", "name"],
        raw: true,
      });

      ctx.status = 200;
      ctx.body = {
        status: true,
        message: "User retrieved successfully",
        data: {
          ...getUserInfo,
          roleName: role?.name || null,
        },
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

// Add User By Admin
const addUserByAdmin = async (ctx: Context) => {
  try {
    const { name, email, roleId, phoneno } = ctx.request.body as userAttributes;

    const existingUser = await User.findOne({ where: { email }, raw: true });
    if (existingUser) {
      ctx.status = 400;
      ctx.body = { status: false, message: "Email already exists" };
      return;
    }

    const plainPassword = generateCustomPassword(name, email);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const createObj: any = {
      name,
      email,
      phoneno,
      password: hashedPassword,
      roleId: roleId || ROLE_TYPES_ID.USER,
    };

    const createdUser = await User.create(createObj);

    if (createdUser) {
      const templateData = {
        name,
        email,
        password: plainPassword,
      };

      await emailSender(
        email,
        EMAILCONSTANT.LOGIN_PASSWORD.subject,
        templateData,
        EMAILCONSTANT.LOGIN_PASSWORD.template
      );

      ctx.status = 200;
      ctx.body = {
        status: true,
        message: "User created successfully and password sent via email",
      };
    } else {
      ctx.status = 400;
      ctx.body = { status: false, message: "Something went wrong" };
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { status: false, message: "Internal Server Error" };
  }
};

export = {
  login,
  register,
  forgotPassword,
  updateUserById,
  deleteUserById,
  getUserById,
  resendOTP,
  verifyOtp,
  resetPassword,
  addUserByAdmin,
};
