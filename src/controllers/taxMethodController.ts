import { Context } from "koa";
import TaxMethods from "../models/taxMethods";

interface taxData {
  id?: number;
  name: string;
  description: string;
  rate: string;
}

// Add Tax Method
const createTaxMethod = async (ctx: Context) => {
  try {
    const { name, description, rate } = ctx.request.body as taxData;

    const newMethod = await TaxMethods.create({ name, description, rate });

    ctx.status = 201;
    ctx.body = {
      message: "Tax method added successfully",
      status: true,
      data: newMethod,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Failed to add tax method", error };
  }
};

// Update Tax Method
const updateTaxMethod = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const { name, description, rate } = ctx.request.body as taxData;

    const method = await TaxMethods.findByPk(id);

    if (!method) {
      ctx.status = 404;
      ctx.body = { status: false, message: "Tax method not found" };
      return;
    }

    await method.update({ name, description, rate });

    ctx.body = {
      message: "Tax method updated successfully",
      status: true,
      data: method,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Failed to update tax method", error };
  }
};

// Delete Tax Method By Id
const deleteTaxMethod = async (ctx: Context) => {
  try {
    const { id } = ctx.params;

    const method = await TaxMethods.findByPk(id);

    if (!method) {
      ctx.status = 404;
      ctx.body = { status: false, message: "Tax method not found" };
      return;
    }

    await method.destroy();

    ctx.body = { status: true, message: "Tax method deleted" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Failed to delete tax method", error };
  }
};

// Get Tax Method By Id
const getTaxMethodById = async (ctx: Context) => {
  try {
    const { id } = ctx.params;

    const method = await TaxMethods.findByPk(id);

    if (!method) {
      ctx.status = 404;
      ctx.body = { status: false, message: "Tax method not found" };
      return;
    }

    ctx.body = { status: true, data: method };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Failed to fetch tax method", error };
  }
};

// Get All Tax Methods
const getAllTaxMethods = async (ctx: Context) => {
  try {
    const methods = await TaxMethods.findAll();

    ctx.body = { status: true, data: methods };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: false, message: "Failed to fetch tax methods", error };
  }
};

export = {
  createTaxMethod,
  updateTaxMethod,
  deleteTaxMethod,
  getTaxMethodById,
  getAllTaxMethods,
};
