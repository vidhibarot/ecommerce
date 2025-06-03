import { Context } from "koa";
import City from "../models/city";

interface cityAttributes {
  id: number;
  name: string;
  stateId:Number;
}

//Gell All City Data
const getAllCity = async (ctx: Context) => {
  try {
    const findCityData = await City.findAll();

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "All City Fetched",
      data: findCityData,
    };
  } catch (error) {
    console.error("err -> ", error);
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    };
  }
};

// Get City by stateId
const getCityByStateId = async (ctx: Context) => {
    console.log("im contrilerrerrrerer",ctx.params.stateId)
  const stateId = ctx.params.stateId;

  try {
    const states = await City.findOne({ where: { stateId } });

    if (!states) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: `No city found for stateId: ${stateId}`,
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: `City fetched for stateId: ${stateId}`,
      data: states,
    };
  } catch (error) {
    console.error("err -> ", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    };
  }
};


export = {
  getAllCity,
  getCityByStateId
};
