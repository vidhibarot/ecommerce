'use strict'
import { Model, DataTypes } from "sequelize"
import roleAttributes from "./interface/RoleInterface";
import { sequelize } from "./index";

export class Role extends Model<roleAttributes, never>
    implements roleAttributes {
    id!: number;
    name!: string;
}

Role.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING
    },
},
    {
        sequelize: sequelize,
        tableName: 'Role',
        modelName: "Role",
    })
