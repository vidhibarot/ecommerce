import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import storeAttribute from "./interface/storeInterface";

export enum status {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export class store extends Model<storeAttribute> implements storeAttribute {
  id!: number;
  name!: string;
  email!: string;
  phone!: string;
  address!: string;
  currency!: string;
  status!: string;

  static associate(db: any) {}
}

store.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    currency: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(status),
      defaultValue: status.ACTIVE,
    },
  },
  {
    sequelize,
    tableName: "store",
    modelName: "store",
  }
);

export default store;
