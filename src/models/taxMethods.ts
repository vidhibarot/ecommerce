"use strict";

import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import taxMethodsAttribute from "./interface/TaxMethodsInterface";

export class TaxMethods
  extends Model<taxMethodsAttribute>
  implements taxMethodsAttribute
{
  id!: number;
  name!: string;
  rate!: string;
  description!: string;

  static associate(db: any) {}
}

TaxMethods.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    rate:{
    type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "TaxMethods",
    modelName: "TaxMethods",
  }
);

export default TaxMethods;
