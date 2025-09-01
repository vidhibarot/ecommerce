import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import cityAttribute from "./interface/CityInterface";

export class City extends Model<cityAttribute> implements cityAttribute {
  id!: number;
  name!: string;
  stateId!: number;
  static associate(db: any) {
    City.belongsTo(db.State, { foreignKey: "stateId" });
  }
}

City.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    stateId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "City",
    modelName: "City",
  }
);

export default City;
