import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import productAttribute from "./interface/ProductInterface";

export class Product
  extends Model<productAttribute>
  implements productAttribute
{
  id!: number;
  userId!: number;
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

  static associate(db: any) {
    Product.hasMany(db.ProductImage, { foreignKey: "productId" });
    Product.hasMany(db.ProductBenefit, { foreignKey: "productId" });
    Product.hasMany(db.ProductUse, { foreignKey: "productId" });
    Product.hasMany(db.ProductStory, { foreignKey: "productId" });
    Product.hasMany(db.Orders, { foreignKey: "productId" });
    Product.hasMany(db.CartItems, { foreignKey: "productId" });
  }
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
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
    sequelize,
    tableName: "Product",
    modelName: "Product",
  }
);

export default Product;
