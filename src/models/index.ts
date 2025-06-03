'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize, { Op, QueryTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const basename = path.basename(__filename);
const db: any = {};
let sequelize: any;

// ✅ Initialize Sequelize
sequelize = new Sequelize.Sequelize(
  process.env.DATABASE || 'ecommerce',
  process.env.DB_USERNAME || 'root',
  process.env.PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    timezone: '+05:30',
    dialectOptions: {
      timezone: '+05:30',
    },
    logging: false, // disable SQL logging
  }
);

// ✅ Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connected');
  })
  .catch((err: any) => {
    console.error('❌ Database connection error:', err.message);
  });

// ✅ Dynamically import and register all models
fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.ts'
    );
  })
  .forEach((file) => {
    const modelModule = require(path.join(__dirname, file));
    const model = modelModule.default;

    if (model?.name) {
      db[model.name] = model;
    }
  });

// ✅ Setup model associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ✅ Export db and utilities
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op;
db.QueryTypes = QueryTypes;

export { db, sequelize, QueryTypes };
