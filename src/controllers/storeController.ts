import { Context } from "koa";
import store from "../models/store";
import { USERSTATUS } from "../config/constant";

interface storeAttributes {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
}

// Add Store Data
const addStoreData = async (ctx: Context) => {
  try {
    const { name, email, phone, address, currency } = ctx.request
      .body as storeAttributes;

    const newStore = await store.create({
      name,
      email,
      phone,
      address,
      currency,
    });

    ctx.status = 201;
    ctx.body = {
      status: true,
      message: "Store created successfully",
      data: newStore,
    };
  } catch (error) {
    console.error("Error ->", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
};

// Update Store By ID
const updateStore = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const { name, email, phone, address, currency } = ctx.request
      .body as storeAttributes;

    const storeData = await store.findOne({ where: { id, status: USERSTATUS.ACTIVE } });

    if (!storeData) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: `No store found with ID ${id}`,
      };
      return;
    }

    await storeData.update({ name, email, phone, address, currency });

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Store updated successfully",
      data: store,
    };
  } catch (error) {
    console.error("Error ->", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
};

// Delete Store By ID
const deleteStore = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const storeData = await store.findOne({ where: { id, status: USERSTATUS.ACTIVE } });

    if (!storeData) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: `No store found with ID ${id}`,
      };
      return;
    }

    await storeData.destroy();

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Store deleted successfully",
    };
  } catch (error) {
    console.error("Error ->", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
};

// Get Store
const getStore = async (ctx: Context) => {
  try {

    const storeData = await store.findOne({
      where: { status: USERSTATUS.ACTIVE },
    });

    if (!storeData) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: `No store found`,
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: `Store fetched successfully`,
      data: storeData,
    };
  } catch (error) {
    console.error("Error -> ", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
};

export = {
  addStoreData,
  updateStore,
  deleteStore,
  getStore,
};
