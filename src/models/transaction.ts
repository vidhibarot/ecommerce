import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import transactionAttribute from "./interface/TransactionInterface";

export enum status {
  INPROGRESS = "Inprogress",
  SUCCESS = "Success",
  FAILED = "Failed",
  REFUNDED = "Refunded",
}

export class Transaction extends Model<transactionAttribute> implements transactionAttribute {
  id!: number;
  orderId!: number;
  amount!:string;
  transationId!: string;
  paymentId!: string;
  paymentMethod!: string;
  status!: string;
  static associate(db: any) {
    Transaction.belongsTo(db.Orders, { foreignKey: "orderId" });
    Transaction.belongsTo(db.Product, { foreignKey: "productId" });
  }
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.STRING,
    },
    transationId: {
      type: DataTypes.STRING,
    },
    paymentId: {
      type: DataTypes.STRING,
    },
    paymentMethod: {
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
    tableName: "Transaction",
    modelName: "Transaction",
  }
);

export default Transaction;
