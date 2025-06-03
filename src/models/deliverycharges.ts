import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import deliveryChargesAttribute from "./interface/DeliveryChargesInterface";

export enum status {
  ACTIVE = "Active",
  INACTIVE = "Inactive"
}

export class DeliveryCharges extends Model<deliveryChargesAttribute> implements deliveryChargesAttribute {
  id!: number;
  city!: string;
  zipcode!: string;
  minOrder!: string;
  charge!: string;
  status!: string;
  static associate(db: any) {
  }
}

DeliveryCharges.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city: {
      type: DataTypes.STRING,
    },
    zipcode: {
      type: DataTypes.STRING,
    },
    minOrder: {
      type: DataTypes.STRING,
    },
    charge: {
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
    tableName: "DeliveryCharges",
    modelName: "DeliveryCharges",
  }
);

export default DeliveryCharges;
