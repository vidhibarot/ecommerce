import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Context, Next } from "koa";

const userAuth = async (ctx: Context, next: Next) => {
  try {
    const authHeader = ctx.headers.authorization;

    if (!authHeader) {
      ctx.status = 403;
      ctx.body = { status: false, message: "Token is required" };
      return;
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string, {
      ignoreExpiration: true,
    });

    const UserData: any = await User.findOne({
      where: { id: decoded.id },
      attributes: ["id", "email", "name"],
      raw: true,
    });

    if (!UserData) {
      ctx.status = 403;
      ctx.body = { status: false, message: "User Not Found" };
      return;
    }

    // Attach user and token to ctx.state
    ctx.state.user = UserData;
    ctx.state.token = token;

    await next();
  } catch (e: any) {
    console.error(e);
    ctx.status = 403;
    ctx.body = {
      status: false,
      message: e.message === "jwt malformed" ? "Token is required" : e.message,
    };
  }
};

export default userAuth;
