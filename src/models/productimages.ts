"use strict";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import { Product } from "./product";
import productImagesAttribute from "./interface/ProductImagesInterface";
export class ProductImage
  extends Model<productImagesAttribute, never>
  implements productImagesAttribute
{
  id!: number;
  productId!: number;
  image!:string
}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
    image:{
     type: DataTypes.STRING,

    }
  },
  {
    sequelize: sequelize,
    tableName: "ProductImages",
    modelName: "ProductImage",
  }
);
ProductImage.belongsTo(Product, { foreignKey: "productId" });
