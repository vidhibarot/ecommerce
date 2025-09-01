"use strict";

import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import shippingMethodsAttribute from "./interface/ShippingMethodInterface";
import { USERSTATUS } from "../config/constant";

export class ShippingMethods
  extends Model<shippingMethodsAttribute>
  implements shippingMethodsAttribute
{
  id!: number;
  name!: string;
  description!: string;
  minOrder!: string;
  amount!: string;
  status!: string;

  static associate(db: any) {}
}

ShippingMethods.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    minOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:0
    },
    amount: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(USERSTATUS),
      defaultValue: USERSTATUS.ACTIVE,
    },
  },
  {
    sequelize,
    tableName: "ShippingMethods",
    modelName: "ShippingMethods",
  }
);

export default ShippingMethods;
