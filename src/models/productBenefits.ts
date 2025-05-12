"use strict";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import productBenefitsAttribute from "./interface/productbenefits";
import { Product } from "./product";
export class ProductBenefit
  extends Model<productBenefitsAttribute, never>
  implements productBenefitsAttribute
{
  id!: number;
  title!: string;
  description!: string;
  productId!: number;
}

ProductBenefit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: sequelize,
    tableName: "ProductBenefits",
    modelName: "ProductBenefits",
  }
);
ProductBenefit.belongsTo(Product, { foreignKey: "productId" });
