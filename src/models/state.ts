import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import stateAttribute from "./interface/StateInterface";

export class State extends Model<stateAttribute> implements stateAttribute {
  id!: number;
  name!: string;
  countryId!: number;
  static associate(db: any) {
    State.belongsTo(db.Country, { foreignKey: "countryId" });
    State.hasMany(db.City, { foreignKey: "stateId" });
  }
}

State.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    countryId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "State",
    modelName: "State",
  }
);

export default State;
