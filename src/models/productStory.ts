"use strict";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import productStoryAttribute from "./interface/productstoryInterface";
import { Product } from "./product";
export class ProductStory
  extends Model<productStoryAttribute, never>
  implements productStoryAttribute
{
  id!: number;
  title!: string;
  description!: string;
  productId!: number;
}

ProductStory.init(
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
    tableName: "ProductStories",
    modelName: "ProductStories",
  }
);
ProductStory.belongsTo(Product, { foreignKey: "productId" });
