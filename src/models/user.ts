"use strict";
import { Model, DataTypes, Optional } from "sequelize";
import userAttributes from "./interface/UserInterface";
import { sequelize } from "./index";
import { Role } from "./role";

type UserCreationAttributes = Optional<userAttributes, "id" | "roleId">;

export class User
  extends Model<userAttributes, UserCreationAttributes>
  implements userAttributes
{
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  roleId!: number;
  phoneno!: string;
}

User.init(
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
    password: {
      type: DataTypes.STRING,
    },
    phoneno: {
      type: DataTypes.STRING,
    },
    roleId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "User",
    modelName: "User",
  }
);

User.belongsTo(Role, { foreignKey: "roleId", as: "role_info" });
