import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
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
