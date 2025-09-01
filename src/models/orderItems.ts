import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import orderItemsAttribute from "./interface/OrderItemsInterface";

export class OrderItems
  extends Model<orderItemsAttribute>
  implements orderItemsAttribute
{
  id?: number;
  orderId!: number;
  productId!: number;
  quantity!: number;
  price!: number;
  static associate(db: any) {
    OrderItems.belongsTo(db.Orders, { foreignKey: "orderId" });

    OrderItems.belongsTo(db.Product, { foreignKey: "productId" });
  }
}

OrderItems.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
    quantity: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "OrderItems",
    modelName: "OrderItems",
  }
);

export default OrderItems;
