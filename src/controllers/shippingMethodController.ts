import { Context } from "koa";
import ShippingMethods from "../models/shippingMethods";

interface shippingData {
  id?: number;
  name: string;
  description: string;
  minOrder: string;
  amount: string;
}

// Add Shipping Methods Data
const createShippingMethod = async (ctx: Context) => {
  try {
    const { name, description, minOrder, amount } = ctx.request.body as shippingData;

    const newMethod = await ShippingMethods.create({
      name,
      description,
      minOrder,
      amount,
    });

    ctx.status = 201;
    ctx.body = {
      message: "Shipping method added successfully",
      status: true,
      data: newMethod,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Failed to add shipping method", error };
  }
};

// Update Shipping Methods Data
const updateShippingMethod = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const { name, description, minOrder, amount } = ctx.request.body as shippingData;

    const method = await ShippingMethods.findByPk(id);

    if (!method) {
      ctx.status = 404;
      ctx.body = { status: false, message: "Shipping method not found" };
      return;
    }

    await method.update({ name, description, minOrder, amount });

    ctx.body = {
      message: "Shipping method updated successfully",
      status: true,
      data: method,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Failed to update shipping method", error };
  }
};

// Delete Shipping Method Data By Id
const deleteShippingMethod = async (ctx: Context) => {
  try {
    const { id } = ctx.params;

    const method = await ShippingMethods.findByPk(id);

    if (!method) {
      ctx.status = 404;
      ctx.body = { status: false, message: "Shipping method not found" };
      return;
    }

    await method.destroy();

    ctx.body = { status: true, message: "Shipping method deleted" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Failed to delete shipping method", error };
  }
};

// Get Shipping Method Data By Id
const getShippingMethodById = async (ctx: Context) => {
  try {
    const { id } = ctx.params;

    const method = await ShippingMethods.findByPk(id);

    if (!method) {
      ctx.status = 404;
      ctx.body = { status: false, message: "Shipping method not found" };
      return;
    }

    ctx.body = { status: true, data: method };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Failed to fetch shipping method", error };
  }
};

// Get All Shipping Methods
const getAllShippingMethods = async (ctx: Context) => {
  try {
    const methods = await ShippingMethods.findAll();

    ctx.body = { status: true, data: methods };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Failed to fetch shipping methods", error };
  }
};

export = {
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
  getShippingMethodById,
  getAllShippingMethods,
};
