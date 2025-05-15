"use strict";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import subCategoryAttribute from "./interface/SubcategoryInterface";
import { Category } from "./category";
export class SubCategory
  extends Model<subCategoryAttribute, never>
  implements subCategoryAttribute
{
  id!: number;
  name!: string;
  categoryId!: number;
}

SubCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    categoryId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: sequelize,
    tableName: "SubCategories",
    modelName: "SubCategories",
  }
);
SubCategory.belongsTo(Category, { foreignKey: "categoryId" });
