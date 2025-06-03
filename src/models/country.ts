import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import countryAttribute from "./interface/CountryInterface";

export class Country
  extends Model<countryAttribute>
  implements countryAttribute
{
  id!: number;
  name!: string;
  static associate(db: any) {
    Country.hasMany(db.State, { foreignKey: "countryId" });
  }
}

Country.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "Country",
    modelName: "Country",
  }
);

export default Country;
