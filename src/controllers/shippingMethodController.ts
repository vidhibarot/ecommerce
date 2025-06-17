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
  const { name, description, minOrder, amount } = ctx.request
    .body as shippingData;
  const newMethod = await ShippingMethods.create({
    name,
    description,
    minOrder,
    amount,
  });
  ctx.status = 201;
  ctx.body = {
    message: "Shipping method added Successfully",
    status: true,
    data: newMethod,
  };
};

// Update Shipping Methods Data
const updateShippingMethod = async (ctx: Context) => {
  const { id } = ctx.params;
  const { name, description, minOrder, amount } = ctx.request
    .body as shippingData;

  const method = await ShippingMethods.findByPk(id);
  if (!method) {
    ctx.status = 404;
    ctx.body = { status: false, message: "Shipping method not found" };
    return;
  }

  await method.update({ name, description, minOrder, amount });
  ctx.body = {
    message: "Shipping method Updated Successfully",
    status: true,
    data: method,
  };
};

// Delete Shipping Method Data By Id
const deleteShippingMethod = async (ctx: Context) => {
  const { id } = ctx.params;
  const method = await ShippingMethods.findByPk(id);
  if (!method) {
    ctx.status = 404;
    ctx.body = { status: false, message: "Shipping method not found" };
    return;
  }

  await method.destroy();
  ctx.body = { status: true, message: "Shipping method deleted" };
};

// Get Shipping Method Data By Id
const getShippingMethodById = async (ctx: Context) => {
  const { id } = ctx.params;
  const method = await ShippingMethods.findByPk(id);
  if (!method) {
    ctx.status = 404;
    ctx.body = { status: false, message: "Shipping method not found" };
    return;
  }
  ctx.body = { status: true, data: method };
};

// Get All Shipping Methods
const getAllShippingMethods = async (ctx: Context) => {
  const methods = await ShippingMethods.findAll();
  ctx.body = { status: true, data: methods };
};

export = {
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
  getShippingMethodById,
  getAllShippingMethods,
};
