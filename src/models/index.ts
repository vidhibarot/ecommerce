//  import { Sequelize } from 'sequelize';
//  import sequelize from '../config/database';
// import userModel from './user';
// import roleModel from "./role"

// const db: any = {};
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;
// db.User = userModel(sequelize);

// export { db };
// export default db;
// 'use strict';

// import fs from 'fs'
// import path from 'path'
// import Sequelize, { Op, QueryTypes } from 'sequelize'
// const basename = path.basename(__filename);

// // const config = global.config;
// const db: any = {};
// let sequelize: any;


// // if (global.config.use_env_variable) {
// //     sequelize = new Sequelize.Sequelize(global.config.use_env_variable, {
// //         ...config,
// //         timezone: "+05:30",  
// //         dialectOptions: {
// //             timezone: "+05:30",
// //         }
// //     });
// // } else {
// //     sequelize = new Sequelize.Sequelize(
// //         process.env.DATABASE || "labour_management",
// //         process.env.DB_USERNAME || "root",
// //         process.env.PASSWORD || "",
// //         {
// //             ...config,
// //             timezone: "+05:30", 
// //             dialectOptions: {
// //                 timezone: "+05:30",
// //             }
// //         }
// //     );
// // }

// sequelize.authenticate().then(() => {

// }).catch((err: any) => {
//     console.log("Db Error", err.message)
//     // emailHelper.sendErrorEmail(err)
// });
// fs
//     .readdirSync(__dirname)
//     .filter(file => {
//         return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts');
//     })
//     .forEach(file => {
//         const model = require(path.join(__dirname, file))
//         db[model.default] = model;
//     });

// Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) {
//         db[modelName].associate(db);
//     }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// db.Op = Op
// db.QueryTypes = QueryTypes

// export { db, sequelize, QueryTypes }
'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize, { Op, QueryTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const basename = path.basename(__filename);
const db: any = {};
let sequelize: any;

// ✅ Initialize Sequelize properly
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
    logging: false, // optional: disables SQL logging in console
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

// ✅ Import all models dynamically
// fs.readdirSync(__dirname)
//   .filter(file => {
//     return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts';
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file));
//     db[model.default.name] = model.default;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))
        db[model.default] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op;
db.QueryTypes = QueryTypes;

export { db, sequelize, QueryTypes };
