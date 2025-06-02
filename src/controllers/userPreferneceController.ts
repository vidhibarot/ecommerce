import { Context } from "koa";
import UserPreference from "../models/userpreference";
import { v4 as uuidv4 } from "uuid";

//Add UserPreference Data

const addUserPreferenceData = async (ctx: Context) => {
  try {
    const userId = ctx?.state?.user?.id;
    const newAddress: any = ctx.request.body;

    // Generate new address_id
    newAddress.address_id = uuidv4();

    // Find existing preference
    const existing = await UserPreference.findOne({ where: { userId } });

    if (existing) {
      // Parse existing address array or initialize empty
      const existingAddresses = existing.address
        ? JSON.parse(existing.address)
        : [];

      // Push the new address
      existingAddresses.push(newAddress);

      // Update the record
      await UserPreference.update(
        { address: JSON.stringify(existingAddresses) },
        { where: { userId } }
      );

      ctx.status = 200;
      ctx.body = {
        status: true,
        message: "Address added to existing user preference",
      };
    } else {
      // First-time insert
      const addressArray = [newAddress];

      const created = await UserPreference.create({
        userId,
        address: JSON.stringify(addressArray),
      });

      ctx.status = 201;
      ctx.body = {
        status: true,
        message: "User preference created with address",
        data: created,
      };
    }
  } catch (error) {
    console.error("Add User Preference Error: ", error);
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const updateUserPreferenceData = async (ctx: Context) => {
  try {
    const userId = ctx?.state?.user?.id;
    const updatedAddress: any = ctx.request.body;

    if (!userId || !updatedAddress?.address_id) {
      ctx.status = 400;
      ctx.body = {
        status: false,
        message: "userId and address_id are required",
      };
      return;
    }

    const existing = await UserPreference.findOne({ where: { userId } });

    if (!existing) {
      ctx.status = 404;
      ctx.body = { status: false, message: "User preference not found" };
      return;
    }

    let addressArray = existing.address ? JSON.parse(existing.address) : [];

    const index = addressArray.findIndex(
      (addr: any) => addr.address_id === updatedAddress.address_id
    );

    if (index === -1) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: "Address not found for the given address_id",
      };
      return;
    }

    addressArray[index] = { ...addressArray[index], ...updatedAddress };

    await UserPreference.update(
      { address: JSON.stringify(addressArray) },
      { where: { userId } }
    );

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Address updated successfully",
    };
  } catch (error) {
    console.error("Update Address Error: ", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export = {
  addUserPreferenceData,
  updateUserPreferenceData,
};
