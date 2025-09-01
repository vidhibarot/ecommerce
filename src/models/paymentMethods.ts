import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import paymentMethodsAttribute from "./interface/PaymementMethodInterface";
import { USERSTATUS } from "../config/constant";
export class PaymentMethods
  extends Model<paymentMethodsAttribute>
  implements paymentMethodsAttribute
{
  id!: number;
  name!: string;
  code!: string;
  description!: string;
  config!: string;
  status!: string;
  static associate(db: any) {}
}

PaymentMethods.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    config: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(USERSTATUS),
      defaultValue: USERSTATUS.ACTIVE,
    },
  },
  {
    sequelize,
    tableName: "PaymentMethods",
    modelName: "PaymentMethods",
  }
);

export default PaymentMethods;
