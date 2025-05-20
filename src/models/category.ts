// 'use strict'
// import { Model, DataTypes } from "sequelize"
// import { sequelize } from "./index";
// import categoryAttribute from "./interface/CategoryInterface";
// export class Category extends Model<categoryAttribute, never>
//  implements categoryAttribute {
//     id!: number;
//     name!: string;
// }

// Category.init({
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
// },
//     {
//         sequelize: sequelize,
//         tableName: "Category",
//         modelName: "Category",
//     })

import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
// import productAttribute from "./interface/ProductInterface";
// import subCategoryAttribute from "./interface/SubcategoryInterface";
import categoryAttribute from "./interface/CategoryInterface";

export class Category
  extends Model<categoryAttribute>
  implements categoryAttribute
{
  id!: number;
  name!: string;

  static associate(db: any) {
    Category.hasMany(db.SubCategory, { foreignKey: "categoryId" });

  }
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "Category",
    modelName: "Category",
  }
);

export default Category;
