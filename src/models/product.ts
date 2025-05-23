"use strict";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import productAttribute from "./interface/ProductInterface";
// import { ProductImage } from "./productimages";

export class Product
  extends Model<productAttribute, never>
  implements productAttribute
{
  // id!: number;
  // name!: string;
  // description!: string;
  // image!: string;
  // price!: number;
  // categoryId!: string;
  // inStock!: number;
  id!: number;
  name!: string;
  description!: string;
  image!: string;
  price!: number;
  categoryId!: string;
  inStock!: number;
  material!: string;
  weight!: string;
  size!: string;
  attributes!: string;
  features!: string;
  discount!: string;
  careInstructions!: string;
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
      type: DataTypes.STRING,
    },
    inStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    attributes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    features: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    careInstructions: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelize,
    tableName: "Product",
    modelName: "Product",
  }
);
// Product.hasMany(ProductImage, {
//   foreignKey: "productId",
// });