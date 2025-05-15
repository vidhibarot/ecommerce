// "use strict";
// import { Model, DataTypes } from "sequelize";
// import { sequelize } from "./index";
// import productStoryAttribute from "./interface/ProductstoryInterface";
// import { Product } from "./product";
// export class ProductStory
//   extends Model<productStoryAttribute, never>
//   implements productStoryAttribute
// {
//   id!: number;
//   title!: string;
//   description!: string;
//   productId!: number;
//   image!: string;
// }

// ProductStory.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     title: {
//       type: DataTypes.STRING,
//     },
//     description: {
//       type: DataTypes.STRING,
//     },
//     productId: {
//       type: DataTypes.INTEGER,
//     },
//     image: {
//       type: DataTypes.STRING,
//     },
//   },
//   {
//     sequelize: sequelize,
//     tableName: "ProductStories",
//     modelName: "ProductStories",
//   }
// );
// ProductStory.belongsTo(Product, { foreignKey: "productId" });
"use strict";

import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import productStoryAttribute from "./interface/ProductstoryInterface";

export class ProductStory
  extends Model<productStoryAttribute>
  implements productStoryAttribute
{
  id!: number;
  title!: string;
  description!: string;
  productId!: number;
  image!: string;

  static associate(db: any) {
    // Define the association to Product
    ProductStory.belongsTo(db.Product, { foreignKey: "productId" });
  }
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
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "ProductStories",
    modelName: "ProductStory", 
  }
);

export default ProductStory;
