// // import { Model, DataTypes } from "sequelize";
// // import { sequelize } from "./index";
// // import userAttributes from "./interface/UserInterface";

// // export class User extends Model<userAttributes> implements userAttributes {
// //   id!: number;
// //   name!: string;
// //   email!: string;
// //   password!: string;
// //   roleId!: number;
// //   phoneno!: string;
// //   static associate(db: any) {
// //     User.belongsTo(db.Role, { foreignKey: "roleId", as: "role_info" });
// //     User.hasMany(db.Orders, { foreignKey: "userId" });
// //   }
// // }

// // User.init(
// //   {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     name: {
// //       type: DataTypes.STRING,
// //     },
// //     email: {
// //       type: DataTypes.STRING,
// //     },
// //     password: {
// //       type: DataTypes.STRING,
// //     },
// //     phoneno: {
// //       type: DataTypes.STRING,
// //     },
// //     roleId: {
// //       type: DataTypes.INTEGER,
// //     },
// //   },
// //   {
// //     sequelize,
// //     tableName: "User",
// //     modelName: "User",
// //   }
// // );

// // export default User;
import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";
import userAttributes from "./interface/UserInterface";

export class User extends Model<userAttributes> implements userAttributes {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  roleId!: number;
  phoneno!: string;

  static associate(db: any) {
    User.belongsTo(db.Role, { foreignKey: "roleId", as: "role_info" });
    User.hasMany(db.Orders, { foreignKey: "userId" });
    User.belongsTo(db.UserPreference, { foreignKey: "userId" });
  }
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

export default User;
