'use strict'
import { Model, DataTypes } from "sequelize"
import { sequelize } from "./index";
import categoryAttribute from "./interface/CategoryInterface";
export class Category extends Model<categoryAttribute, never>
 implements categoryAttribute {
    id!: number;
    name!: string;
}

Category.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
},
    {
        sequelize: sequelize,
        tableName: "Category",
        modelName: "Category",
    })

