"use strict";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import productAttribute from "./interface/ProductInterface";
import { Category } from "./category";
export const STOCK_STATUS = {
  IN_STOCK: 1,
  OUT_OF_STOCK: 0,
};

export class Product
  extends Model<productAttribute, never>
  implements productAttribute
{
  id!: number;
  name!: string;
  description!: string;
  image!: string;
  price!: number;
  categoryId!: number;
  inStock!: number;
}

Product.init(
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
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,

    },
    categoryId: {
      type: DataTypes.INTEGER,
    },
    inStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: STOCK_STATUS.IN_STOCK,
    },
  },
  {
    sequelize: sequelize,
    tableName: "Product",
    modelName: "Product",
  }
);

Product.belongsTo(Category, { foreignKey: "categoryId" });
