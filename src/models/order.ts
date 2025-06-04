import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import orderAttribute from "./interface/OrderInterface";

export enum status {
  INPROGRESS = "Inprogress",
  SHIPPED = "Shipped",
  DELIVERD = "Delivered",
  FAILED = "Failed",
  CANCELLED = "Cancelled",
  REFUNDED = "Refunded",
}

export class Orders extends Model<orderAttribute> implements orderAttribute {
  id?: number;
  orderId!: string;
  userId!: number;
  // productId!: number;
  customerName!: string;
  email!: string;
  phoneno!: string;
  address!: string;
  // quantity!: number;
  // price!: number;
  deliveryCharges!: number;
  totalAmount!: number;
  status!: string;
  static associate(db: any) {
    // Orders.belongsTo(db.Product, { foreignKey: "productId" });
    Orders.hasMany(db.OrderItems, { foreignKey: "orderId" });

    // Orders.hasMany(db.Transaction, { foreignKey: "orderId" });
  }
}

Orders.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    // productId: {
    //   type: DataTypes.INTEGER,
    // },
    customerName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    phoneno: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    // quantity: {
    //   type: DataTypes.STRING,
    // },
    // price: {
    //   type: DataTypes.STRING,
    // },
    deliveryCharges: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 0,
    },
    totalAmount: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(status),
      defaultValue: status.INPROGRESS,
    },
  },
  {
    sequelize,
    tableName: "Orders",
    modelName: "Orders",
  }
);

export default Orders;
