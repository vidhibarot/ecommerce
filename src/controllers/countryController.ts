import { Context } from "koa";
import Country from "../models/country";
interface countryAttributes {
  id: number;
  name: string;
}

//Gell All Country Data
const getAllCountry = async (ctx: Context) => {
  try {
    const findCountryData = await Country.findAll();

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "All Country Fetched",
      data: findCountryData,
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


export = {
  getAllCountry
};
