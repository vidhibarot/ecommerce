import { Context } from "koa";
import PaymentMethods from "../models/paymentMethods";
import { USERSTATUS } from "../config/constant";
interface paymentData {
  id?: number;
  name: string;
  description :string;
  code:string;
  config:string;
}


// Add Payment Method
const addPaymentMethod = async (ctx: Context) => {
  try {
    const { name, code, description, config } = ctx.request.body as paymentData;

    const paymentMethod = await PaymentMethods.create({
      name,
      code,
      description,
      config,
    });

    ctx.status = 201;
    ctx.body = {
      status: true,
      message: "Payment method created successfully",
      data: paymentMethod,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Internal Server Error", error };
  }
};

//Update Payment Method
const updatePaymentMethod = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const data = ctx.request.body as paymentData;

    const [updated] = await PaymentMethods.update(data, { where: { id } });

    if (!updated) {
      ctx.status = 404;
      ctx.body = { status: false, message: "Payment method not found" };
      return;
    }

    ctx.body = { status: true, message: "Payment method updated successfully" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Internal Server Error", error };
  }
};

// Delete Payment Method
const deletePaymentMethod = async (ctx: Context) => {
  try {
    const { id } = ctx.params;

    const deleted = await PaymentMethods.destroy({ where: { id } });

    if (!deleted) {
      ctx.status = 404;
      ctx.body = { status: false, message: "Payment method not found" };
      return;
    }

    ctx.body = { status: true, message: "Payment method deleted successfully" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Internal Server Error", error };
  }
};

// Get Payment Method By Id
const getPaymentMethodById = async (ctx: Context) => {
  try {
    const { id } = ctx.params;

    const method = await PaymentMethods.findOne({
      where: { id, status: USERSTATUS.ACTIVE },
    });

    if (!method) {
      ctx.status = 404;
      ctx.body = { status: false, message: "Payment method not found" };
      return;
    }

    ctx.body = { status: true, data: method };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Internal Server Error", error };
  }
};

// Get All Payment Methods
const getAllPaymentMethods = async (ctx: Context) => {
  try {
    const methods = await PaymentMethods.findAll();

    ctx.body = { status: true, data: methods };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Internal Server Error", error };
  }
};

export={
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getPaymentMethodById,
  getAllPaymentMethods,
};
