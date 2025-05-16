"use strict";

import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import productBenefitsAttribute from "./interface/ProductbenefitsInterface";

export class ProductBenefit
  extends Model<productBenefitsAttribute>
  implements productBenefitsAttribute
{
  id!: number;
  title!: string;
  description!: string;
  productId!: number;

  static associate(db: any) {
    ProductBenefit.belongsTo(db.Product, { foreignKey: "productId" });
  }
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
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "ProductBenefits",
    modelName: "ProductBenefit",
  }
);

export default ProductBenefit;
