import { Context } from "koa";
import TaxMethods from "../models/taxMethods";

interface taxData {
  id?: number;
  name: string;
  description: string;
  rate: string;
}

// Add Tax Methods Data
const createTaxMethod = async (ctx: Context) => {
  const { name, description, rate } = ctx.request
    .body as taxData;
  const newMethod = await TaxMethods.create({
    name,
    description,
    rate,
  });
  ctx.status = 201;
  ctx.body = {
    message: "Tax method added Successfully",
    status: true,
    data: newMethod,
  };
};

// Update Tax Methods Data
const updateTaxMethod = async (ctx: Context) => {
  const { id } = ctx.params;
  const { name, description, rate, } = ctx.request
    .body as taxData;

  const method = await TaxMethods.findByPk(id);
  if (!method) {
    ctx.status = 404;
    ctx.body = { status: false, message: "Tax method not found" };
    return;
  }

  await method.update({ name, description, rate });
  ctx.body = {
    message: "Tax method Updated Successfully",
    status: true,
    data: method,
  };
};

// Delete Shipping Method Data By Id
const deleteTaxMethod = async (ctx: Context) => {
  const { id } = ctx.params;
  const method = await TaxMethods.findByPk(id);
  if (!method) {
    ctx.status = 404;
    ctx.body = { status: false, message: "Tax method not found" };
    return;
  }

  await method.destroy();
  ctx.body = { status: true, message: "Tax method deleted" };
};

// Get Shipping Method Data By Id
const getTaxMethodById = async (ctx: Context) => {
  const { id } = ctx.params;
  const method = await TaxMethods.findByPk(id);
  if (!method) {
    ctx.status = 404;
    ctx.body = { status: false, message: "Tax method not found" };
    return;
  }
  ctx.body = { status: true, data: method };
};

// Get All Shipping Methods
const getAllTaxMethods = async (ctx: Context) => {
  const methods = await TaxMethods.findAll();
  ctx.body = { status: true, data: methods };
};

export = {
  createTaxMethod,
  updateTaxMethod,
  deleteTaxMethod,
  getTaxMethodById,
  getAllTaxMethods,
};
