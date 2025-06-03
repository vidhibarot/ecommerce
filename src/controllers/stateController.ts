import { Context } from "koa";
import State from "../models/state";
interface stateAttributes {
  id: number;
  name: string;
  countryId:number;
}

//Gell All State Data
const getAllState = async (ctx: Context) => {
  try {
    const findStateData = await State.findAll();

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "All State Fetched",
      data: findStateData,
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

// Get States by countryId
const getStatesByCountryId = async (ctx: Context) => {
  const countryId = ctx.params.countryId;

  try {
    const states = await State.findOne({ where: { countryId } });

    if (!states) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: `No states found for countryId: ${countryId}`,
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: `States fetched for countryId: ${countryId}`,
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
  getAllState,
  getStatesByCountryId
};
