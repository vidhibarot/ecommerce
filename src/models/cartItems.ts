import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import cartItemsAttribute from "./interface/CartItemsInterface";

export class CartItems
  extends Model<cartItemsAttribute>
  implements cartItemsAttribute
{
  id!: number;
  userId!: number;
  productId!: number;
  quantity!: number;

  static associate(db: any) {
    CartItems.belongsTo(db.Product, { foreignKey: "productId" });
  }
}

CartItems.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "CartItems",
    modelName: "CartItems",
  }
);

export default CartItems;
