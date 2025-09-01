import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import userPreferenceAttributes from "./interface/UserPreferenceInterface";

export class UserPreference
  extends Model<userPreferenceAttributes>
  implements userPreferenceAttributes
{
  id!: number;
  userId!: number;
  address!: string;

  static associate(db: any) {
    // UserPreference.belongsTo(db.User, { foreignKey: "userId" });
  }
}

UserPreference.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    address: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: "UserPreference",
    modelName: "UserPreference",
  }
);

export default UserPreference;
