// "use strict";
// import { Model, DataTypes } from "sequelize";
// import { sequelize } from "./index";
// import productUseAttribute from "./interface/productuse";
// import { Product } from "./product";
// export class ProductUse
//   extends Model<productUseAttribute, never>
//   implements productUseAttribute
// {
//   id!: number;
//   title!: string;
//   description!: string;
//   productId!: number;
// }

// ProductUse.init(
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
//   },
//   {
//     sequelize: sequelize,
//     tableName: "ProductUses",
//     modelName: "ProductUses",
//   }
// );
// ProductUse.belongsTo(Product, { foreignKey: "productId" });
"use strict";

import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import productUseAttribute from "./interface/productuse";

export class ProductUse
  extends Model<productUseAttribute>
  implements productUseAttribute
{
  id!: number;
  title!: string;
  description!: string;
  productId!: number;

  static associate(db: any) {
    ProductUse.belongsTo(db.Product, { foreignKey: "productId" });
  }
}

ProductUse.init(
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
    tableName: "ProductUses",
    modelName: "ProductUse", 
  }
);

export default ProductUse;
